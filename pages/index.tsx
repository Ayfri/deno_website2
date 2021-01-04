/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import Link from "next/link";
import CodeBlock from "../components/CodeBlock";
import Footer from "../components/Footer";
import versions from "../versions.json";
import { NextPage, GetStaticProps } from "next";
import InlineCode from "../components/InlineCode";
import Header from "../components/Header";
import { CookieBanner } from "../components/CookieBanner";

interface HomeProps {
  latestStd: string;
}

const Home: NextPage<HomeProps> = ({ latestStd }) => {
  const complexExampleProgram = `import { serve } from "https://deno.land/std@${latestStd}/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}`;

  return (
    <>
      <Head>
        <title>Deno - Un runtime sécurisé pour JavaScript et TypeScript</title>
      </Head>
      <CookieBanner />
      <div className="bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <Header />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col items-center">
            <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
              Deno
            </h1>
            <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
              Un runtime <strong className="font-semibold">sécurisé</strong>{" "}
              pour <strong className="font-semibold">JavaScript</strong> et{" "}
              <strong className="font-semibold">TypeScript</strong>.
            </h2>

            <a
              href="https://github.com/denoland/deno/releases/latest"
              className="rounded-full mt-4 px-8 py-2 transition-colors duration-75 ease-in-out bg-blue-500 hover:bg-blue-400 text-white shadow-lg"
            >
              {versions.cli[0]}
            </a>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <p className="my-4 text-gray-700">
            Deno est un runtime simple, moderne et sécurisé pour JavaScript et
            TypeScript qui utilise V8 et est codé en Rust.
          </p>
          <ol className="ml-8 list-disc text-gray-700">
            <li>
              Sécurisé par défaut. Aucun accès aux fichiers, au réseau ou à
              l'environnement, sauf si explicitement autorisé.
            </li>
            <li>Supporte TypeScript nativement.</li>
            <li>Consiste en un seul fichier exécutable.</li>
            <li>
              Possède des utilitaires intégrés comme un inspecteur de
              dépendances (<InlineCode>deno info</InlineCode>) et un formateur
              de code (<InlineCode>deno fmt</InlineCode>).
            </li>
            <li>
              Dispose d'un ensemble de modules standards (audités) garantis de
              fonctionner avec Deno:{" "}
              <a href="https://deno.land/std" className="link">
                deno.land/std
              </a>
            </li>
          </ol>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#installation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="installation">
                Installation
              </h3>
            </a>
          </Link>
          <InstallSection />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#getting-started">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="getting-started">
                Commencer
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Essayez d'exécuter un programme simple:
          </p>
          <CodeBlock
            code="deno run https://deno.land/std/examples/welcome.ts"
            language="bash"
          />
          <p className="my-4 text-gray-700">Ou un plus complexe:</p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <CodeBlock
            code={complexExampleProgram}
            language="typescript"
            disablePrefixes
          />
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8">
          <p className="my-4 text-gray-700">
            Vous pouvez trouver une introduction plus détaillée, des exemples et
            des guides de configuration de l'environnement dans{" "}
            <Link href="/manual">
              <a className="link">le manuel</a>
            </Link>
            .
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#runtime-documentation">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="runtime-documentation">
                Documentation du runtime
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            La documentation du runtime de base pour Deno est disponible sur{" "}
            <a href="https://doc.deno.land/builtin/stable" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Deno est livré avec{" "}
            <Link href="/manual">
              <a className="link">un manuel</a>
            </Link>{" "}
            qui contient des explications plus détaillées sur les fonctions les
            plus complexes du runtime, une introduction aux concepts sur
            lesquels Deno est construit, des détails sur les composants internes
            de Deno, comment intégrer Deno dans votre propre application et
            comment étendre Deno à l'aide de plugins Rust.
          </p>
          <p className="my-4 text-gray-700">
            Le manuel contient également des informations sur les outils
            intégrés fournis par Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#standard-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="standard-modules">
                Modules Standards
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            En plus du runtime Deno, Deno fournit également une liste de modules
            standard audités qui sont examinés par les responsables de Deno et
            qui sont garantis pour fonctionner avec une version Deno spécifique.
            Ceux-ci cohabitent avec le code source de Deno dans le dépôt{" "}
            <a href="https://github.com/denoland/deno" className="link">
              denoland/deno
            </a>{" "}
            .
          </p>
          <p className="my-4 text-gray-700">
            Ces modules standards sont hébergés chez{" "}
            <Link href="/std">
              <a className="link">deno.land/std</a>
            </Link>{" "}
            et sont distribués via des URL comme tous les autres modules ES
            compatibles avec Deno.
          </p>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-20">
          <Link href="#third-party-modules">
            <a className="hover:underline">
              <h3 className="font-bold text-xl" id="third-party-modules">
                Modules tiers
              </h3>
            </a>
          </Link>
          <p className="my-4 text-gray-700">
            Deno peut importer des modules de n'importe quel emplacement sur le
            Web, comme GitHub, un serveur Web personnel ou un CDN comme{" "}
            <a href="https://www.skypack.dev" className="link">
              Skypack
            </a>
            ,{" "}
            <a href="https://jspm.io" className="link">
              jspm.io
            </a>{" "}
            or{" "}
            <a href="https://www.jsdelivr.com/" className="link">
              jsDelivr
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            Pour faciliter l'utilisation de modules tiers, Deno fournit des
            outils intégrés tels que <InlineCode>deno info</InlineCode> et{" "}
            <InlineCode>deno doc</InlineCode>. deno.land fournit également une
            UI Web pour consulter la documentation de modules. Disponible sur{" "}
            <a href="https://doc.deno.land" className="link">
              doc.deno.land
            </a>
            .
          </p>
          <p className="my-4 text-gray-700">
            deno.land fournit également un service d'hébergement public simple
            pour les modules ES qui fonctionnent avec Deno. Il peut être trouvé
            à{" "}
            <Link href="/x">
              <a className="link">deno.land/x</a>
            </Link>
            .
          </p>
        </div>
        <div className="mt-20">
          <Footer simple />
        </div>
      </div>
    </>
  );
};

const InstallSection = () => {
  const shell = (
    <div key="shell" className="my-4 text-gray-700">
      <p className="py-2">Shell (Mac, Linux):</p>
      <CodeBlock
        language="bash"
        code={`curl -fsSL https://deno.land/x/install/install.sh | sh`}
      />
    </div>
  );
  const homebrew = (
    <div key="homebrew" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://formulae.brew.sh/formula/deno" className="link">
          Homebrew
        </a>{" "}
        (Mac):
      </p>
      <CodeBlock language="bash" code={`brew install deno`} />
    </div>
  );
  const powershell = (
    <div key="powershell" className="my-4 text-gray-700">
      <p className="mb-2">PowerShell (Windows):</p>
      <CodeBlock
        language="bash"
        code={`iwr https://deno.land/x/install/install.ps1 -useb | iex`}
      />
    </div>
  );
  const chocolatey = (
    <div key="chocolatey" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://chocolatey.org/packages/deno" className="link">
          Chocolatey
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code={`choco install deno`} />
    </div>
  );
  const scoop = (
    <div key="scoop" className="my-4 text-gray-700">
      <p className="mb-2">
        <a href="https://scoop.sh/" className="link">
          Scoop
        </a>{" "}
        (Windows):
      </p>
      <CodeBlock language="bash" code={`scoop install deno`} />
    </div>
  );
  const cargo = (
    <div key="cargo" className="my-4 text-gray-700">
      <p className="py-2">
        Construire et installer à partir de la source en utilisant{" "}
        <a href="https://crates.io/crates/deno" className="link">
          Cargo
        </a>
      </p>
      <CodeBlock language="bash" code={`cargo install deno`} />
    </div>
  );

  return (
    <>
      <p className="my-4 text-gray-700">
        Deno est livré comme un exécutable unique sans dépendances. Vous pouvez
        l'installer à l'aide des programmes d'installation ci-dessous ou
        télécharger un binaire de version à partir de la{" "}
        <a href="https://github.com/denoland/deno/releases" className="link">
          page des versions
        </a>
        .
      </p>
      {shell}
      {powershell}
      {homebrew}
      {chocolatey}
      {scoop}
      {cargo}
      <p className="my-4 text-gray-700">
        Voir{" "}
        <a className="link" href="https://github.com/denoland/deno_install">
          deno_install
        </a>{" "}
        pour plus d'options d'installation.
      </p>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      latestStd: versions.std[0],
    },
  };
};

export default Home;
