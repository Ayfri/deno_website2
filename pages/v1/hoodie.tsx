/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { CookieBanner } from "../../components/CookieBanner";

function V1Hoodie(): React.ReactElement {
  return (
    <>
      <Head>
        <title>1.0 Hoodie | Deno</title>
      </Head>
      <CookieBanner />
      <Header />
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-8 mb-16">
        <h1 className="text-3xl tracking-tight font-bold text-5xl leading-10">
          Deno 1.0 Hoodie
        </h1>
        <p className="text-gray-500 mt-3 leading-tight">
          Durée limitée, qualité supérieure
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div>
            <img src="/v1_hoodie_mock.png" alt="deno hoodie" />
          </div>
          <div>
            <p className="text-gray-900">
              Aidez à soutenir le projet Deno en précommandant un sweatshirt à
              capuche Deno v1.0 en édition spéciale pour une durée limitée. Ce
              sweatshirt noir à capuche zippé présente l'illustration de la
              version 1.0 du célèbre hacker/artiste basé à Tokyo{" "}
              <a className="link" href="https://github.com/hashrock">
                hashrock
              </a>
              .
            </p>
            <p className="text-gray-900 mt-4">
              Pour être clair : il s'agit d'une précommande. Nous ne les avons
              pas encore fait fabriquer. L'image ci-dessus est une maquette
              photoshoppée. Nous prendrons les commandes jusqu'au 21 mai, après
              quoi ce sweatshirt à capuche en édition limitée ne sera plus
              jamais vendu. Nous prévoyons de les expédier en juillet.
            </p>
            <p className="text-gray-900 font-bold text-2xl leading-tight mt-4">
              $100
            </p>
            <p className="text-gray-500 mt-1 leading-tight">$15 expédition</p>
            <h1 className="py-8 text-3xl tracking-tight">Plus en stock</h1>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default V1Hoodie;
