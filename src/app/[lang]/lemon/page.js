import React from "react";
import { getDictionary } from "../../../../getDictionary";
import LemonClient from "./LemonClient";

export default async function Lemon({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <LemonClient dict={dict} lang={lang} />;
}
 