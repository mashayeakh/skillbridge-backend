type TutorTypes = {
    // tutorProfileId: string,
    name: string,
    bio: string,
    hourlyRate: number,
    experienceYears: number,
    rating: number,
    isVerified: boolean,
    userId: string,
    categoryId: string
}

//omit the tutorProfileId
// type TutorCreatePayload = Omit<TutorTypes, "tutorProfileId">;

export { TutorTypes }

