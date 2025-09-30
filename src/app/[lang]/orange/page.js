import React from "react";
import { getDictionary } from "../../../../getDictionary";
import OrangeClient from "./OrangeClient";

export default async function Orange({ params }) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  return <OrangeClient dict={dict} lang={lang} />;
}
 