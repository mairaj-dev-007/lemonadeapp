import React from "react";
import { getDictionary } from "../../../../getDictionary";
import TeaClient from "./TeaClient";

export default async function Tea({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <TeaClient dict={dict} lang={lang} />;
}

