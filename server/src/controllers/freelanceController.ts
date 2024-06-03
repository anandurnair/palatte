import { Request, Response } from "express";
import UserModal from "../models/user";
import STATUS_CODES from "../utils/constants";
const freelanceController: any = {};

freelanceController.getFreelancersByService = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const serviceId = req.query.serviceId;
    const freelancers = await UserModal.find({ services: serviceId });
    console.log("Freelancers", freelancers);
    res
      .status(STATUS_CODES.OK)
      .json({ message: "freelancers successfully fetched", freelancers });
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default freelanceController;
