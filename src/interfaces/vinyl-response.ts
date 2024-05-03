import { Vinyl } from "../vinyl/entities/vinyl.entity";

export interface VinylResponse {
    vinyls: Vinyl[];
    pages: number;
    take: number;
    skip: number;
}
