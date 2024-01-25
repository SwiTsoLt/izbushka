export class PostCategoryDTO {
  name: string;
  children: PostCategoryDTO[];
}

export class UpdateCategoryDTO {
  name: string;
  children: UpdateCategoryDTO[];
}
