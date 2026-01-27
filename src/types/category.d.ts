type CategoryTypes = {
    categoryId: string,
    name: string,
    description: string,
    isActive: boolean
}

//omit the category
type CategoryCreatePayload = Omit<CategoryTypes, "categoryId">;

export { CategoryTypes, CategoryCreatePayload }