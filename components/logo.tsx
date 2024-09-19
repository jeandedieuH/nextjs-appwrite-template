import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <Image src="/assets/images/logo.png" alt="logo" width={150} height={75} />
    </Link>
  );
};

export default Logo;
