import React from "react";
import { getDictionary } from "../../../../getDictionary";
import MangoClient from "./MangoClient";

export default async function Mango({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <MangoClient dict={dict} lang={lang} />;
}

