import { Request, Response } from "express";
import { PublicService } from "./public.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const PublicController = {

    // 1. Browse tutors with optional query filters
    browseTutors: asyncHandler(
        async (req: Request, res: Response) => {
            const { categoryId, minRating, maxPrice, search } = req.query;

            const tutors = await PublicService.browseTutors({
                categoryId: categoryId as string,
                minRating: minRating ? Number(minRating) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                search: search as string
            });

            res.status(200).json({
                success: true,
                data: tutors
            });
        }
    ),

    // 2. Tutor detail by tutor profile id
    getTutorDetail: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const tutor = await PublicService.getTutorById(id as string);

            if (!tutor) {
                return res.status(404).json({
                    success: false,
                    message: "Tutor not found"
                });
            }

            res.status(200).json({
                success: true,
                data: tutor
            });
        }
    ),

    // 3. Featured tutors
    featuredTutors: asyncHandler(

        async (req: Request, res: Response) => {
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const tutors = await PublicService.getFeaturedTutors(limit);

            res.status(200).json({
                success: true,
                data: tutors
            });
        }
    )
};
