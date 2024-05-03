import { Review } from "../review/entities/review.entity";

export interface ReviewResponse {
    reviews: Review[];
    pages: number;
    take: number;
    skip: number;
}
