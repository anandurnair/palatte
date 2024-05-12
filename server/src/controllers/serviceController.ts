import { Request, Response } from "express";
import ServiceModal from "../models/service";
const serviceController : any = {}
import STATUS_CODES from '../utils/constants'


serviceController.createService = async (                                                      
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
     const {serviceName} = req.body;
     const isExist = await ServiceModal.findOne({serviceName});
     if(isExist){
        res.status(STATUS_CODES.BAD_REQUEST).json({error:"Service already exists"})
     }
     const newService: any = new ServiceModal({
        serviceName
      });
      await newService.save();
      res.status(STATUS_CODES.OK).json({ message: "User created successfully!"});
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
  serviceController.serviceList = async (                                                      
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
        console.log('Working');
        
     const services = await ServiceModal.find();
      res.status(STATUS_CODES.OK).json({ message: "Services fetched successfully!",services});
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
