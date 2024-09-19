declare interface getUserInfoProps {
  userId: string;
}

declare type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare interface SaveUserProps {
  userId: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  phone: string;
}
