import { FormControl, FormGroup } from "@angular/forms";
import { PostLocationFormGroup } from "@models/post.model";
import { UserAvatar, UserAvatarFormGroup } from "@models/user.model";

export interface IUpdateForm {
    avatar: FormGroup<UserAvatarFormGroup>,
    first_name: FormControl<string>,
    location: FormGroup<PostLocationFormGroup>,
}

export interface IUpdateFormValues {
    avatar: UserAvatar,
    first_name: string,
    location: PostLocationFormGroup,
}

interface ILocation {
    area?: string,
    regiton?: string,
}

export interface IUpdateUserDTO {
    avatar?: File,
    first_name?: string,
    location?: ILocation,
}