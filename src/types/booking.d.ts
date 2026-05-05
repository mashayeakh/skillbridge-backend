export type BookingInput = {
    studentId: string,
    tutorProfileId: string,
    startTime: Date,
    endTime: Date,
    status: BookingStatus,
    price: number,
    slotId?: string
}



// export {
//     BookingInput
// }

// studentId: string; tutorId: string; startTime: Date; endTime: Date 