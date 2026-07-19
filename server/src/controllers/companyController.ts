import { Request, Response } from "express";
import {
  createCompany,
  getMyCompany,
} from "../services/companyService.js";



// POST /api/company
export async function createCompanyController(
  req: Request,
  res: Response
) {

    console.log("Request body:", req.body); // Log the request body for debugging

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      name,
      companyCode,
    } = req.body;


    const company =
      await createCompany(
        name,
        userId,
        companyCode // Include companyCode in the createCompany call
      );


    res.status(201).json({
      message: "Company created successfully",
      company,
    });


  } catch (error: any) {

    res.status(400).json({
      message: error.message,
    });

  }
}



// GET /api/company
export async function getMyCompanyController(
  req: Request,
  res: Response
) {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    
    const company =
      await getMyCompany(
        userId
      );


    res.status(200).json({
      company,
    });


  } catch (error: any) {

    res.status(404).json({
      message: error.message,
    });

  }
}