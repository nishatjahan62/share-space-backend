import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as contactService from "../../modules/contact/contact.service.js";

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const saved = await contactService.createContactMessage(req.body);

  res
    .status(201)
    .json(
      ApiResponse.success(
        saved,
        "Message received. We'll get back to you soon.",
      ),
    );
});