import { Dispatch, SetStateAction } from "react";

export interface IUsersProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
}
