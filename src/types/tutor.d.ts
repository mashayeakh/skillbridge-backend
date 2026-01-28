type TutorTypes = {
    // tutorProfileId: string,
    name: string,
    bio: string,
    hourlyRate: number,
    experienceYears: number,
    rating: number,
    // isVerified: boolean,
    userId: string,
    categoryId: string
}

type UpdateTutorProfileInput = {
    tutorProfileId: string;      // the profile id, not userId
    name?: string;
    bio?: string;
    hourlyRate?: number;
    experienceYears?: number;
    rating?: number;
    categoryIds?: string[];      // multiple categories to update
};

//omit the tutorProfileId
// type TutorCreatePayload = Omit<TutorTypes, "tutorProfileId">;

export { TutorTypes, UpdateTutorProfileInput }

