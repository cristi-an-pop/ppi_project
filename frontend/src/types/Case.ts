import { Tooth } from "./Tooth";

export interface Case {
    id?: string;
    clientId: string;
    title: string;
    image: File | null;
    teeth: Tooth[];
}