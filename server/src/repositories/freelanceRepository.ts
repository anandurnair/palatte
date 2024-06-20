import FreelanceDetailsModel from "../models/freelanceDetails";

class FreelanceDetailsRepository {
  async findByService(serviceName: string) {
    return await FreelanceDetailsModel.find({ "services.title": serviceName }).populate("userId");
  }

  async findByUserIdsAndService(userIds: string[], serviceName: string) {
    return await FreelanceDetailsModel.find({
      userId: { $in: userIds },
      "services.title": serviceName,
    }).populate("userId");
  }

  async findOneByUserId(userId: string) {
    return await FreelanceDetailsModel.findOne({ userId });
  }

  async addServiceToUser(userId: string, service: any) {
    const userFreelanceDetails = await FreelanceDetailsModel.findOne({ userId });

    if (userFreelanceDetails) {
      userFreelanceDetails.services.push(service);
      await userFreelanceDetails.save();
      return userFreelanceDetails;
    }

    const newFreelance = new FreelanceDetailsModel({
      userId,
      services: [service],
    });

    return await newFreelance.save();
  }

  async updateServiceById(freelanceId: string, details: any) {
    return await FreelanceDetailsModel.findOneAndUpdate(
      { "services._id": freelanceId },
      {
        $set: {
          "services.$.title": details.title,
          "services.$.description": details.description,
          "services.$.plans": details.plans,
        },
      },
      { new: true }
    );
  }

  async removeServiceByUserIdAndTitle(userId: string, serviceName: string) {
    const freelancerServices = await FreelanceDetailsModel.findOne({ userId });

    if (freelancerServices) {
      const serviceIndex = freelancerServices.services.findIndex(
        (service) => service.title === serviceName
      );

      if (serviceIndex > -1) {
        freelancerServices.services.splice(serviceIndex, 1);
        await freelancerServices.save();
        return freelancerServices;
      }
    }

    return null;
  }
}

export default new FreelanceDetailsRepository();
