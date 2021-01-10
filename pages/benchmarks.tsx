/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  BenchmarkData,
  Column,
  reshape,
  formatLogScale,
  formatMB,
  formatPercentage,
  formatReqSec,
  formatKB,
} from "../util/benchmark_utils";
import BenchmarkChart, { BenchmarkLoading } from "../components/BenchmarkChart";
import { CookieBanner } from "../components/CookieBanner";

// TODO(lucacasonato): add anchor points to headers
function Benchmarks(): React.ReactElement {
  const _ = useRouter();
  const location = typeof window !== "undefined" ? window.location : null;
  const typescriptBenches = ["check", "no_check", "bundle", "bundle_no_check"];

  let show!: { dataFile: string; range: number[]; search: string };
  // Default (recent).
  show = {
    dataFile: "recent.json",
    range: [],
    search: "",
  };
  while (location) {
    // Show all.
    if (location.search.endsWith("?all")) {
      show = { dataFile: "data.json", range: [], search: "all" };
      break;
    }
    // Custom range.
    const range = decodeURIComponent(location.search)
      .split(/([?,]|\.{2,})/g)
      .filter(Boolean)
      .map(Number)
      .filter(Number.isInteger);
    if ([1, 2].includes(range.length)) {
      const search = range.join("...");
      show = { dataFile: "data.json", range, search };
      break;
    }
    break;
  }
  if (
    location != null &&
    location.search !== show.search &&
    location.search !== `?${show.search}`
  ) {
    location.replace(location.toString().replace(/\?.*$/, `?${show.search}`));
  }

  const showAll = show.dataFile !== "recent.json";
  const dataUrl = `https://denoland.github.io/benchmark_data/${show.dataFile}`;

  const [data, setData] = React.useState<BenchmarkData | null>(null);
  const [dataRangeTitle, setDataRangeTitle] = React.useState<string>("");
  const [showNormalized, setShowNormalized] = React.useState(false);

  React.useEffect(() => {
    setData(null);
    fetch(dataUrl).then(async (response) => {
      const rawData = await response.json();
      const data = reshape(rawData.slice(...show.range));
      setData(data);

      // Show actual range in title bar (except when showing 'recent' only).
      if (typeof window !== "undefined") {
        setDataRangeTitle(
          showAll
            ? [(ks: number[]) => ks[0], (ks: number[]) => ks.pop()]
                .map((f) => f([...rawData.keys()].slice(...show.range)))
                .filter((k) => k != null)
                .join("...")
            : ""
        );
      }
    });
  }, [show.search]);

  return (
    <>
      <Head>
        <title>
          Benchmarks {dataRangeTitle ? `(${dataRangeTitle})` : `| Deno`}
        </title>
      </Head>
      <CookieBanner />
      <div className="bg-gray-50 min-h-full">
        <Header subtitle="Continuous Benchmarks" />
        <div className="mb-12">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8">
            <img src="/images/deno_logo_4.gif" className="mb-12 w-32 h-32" />
            <h4 className="text-2xl font-bold tracking-tight">About</h4>
            <p className="mt-4">
              Dans le cadre de l'intégration continue de Deno et de sa chaîne
              d'essai, nous mesurer les performances de certaines mesures clés
              du temps d'exécution. Vous peuvent consulter ces évaluations ici.
            </p>
            <p className="mt-4">
              Vous consultez actuellement les données de{" "}
              {showAll ? "tous les" : "les plus récents"} commits pour la
              branche <a href="https://github.com/denoland/deno">master</a>.
              Vous pouvez également voir{" "}
              <Link href={!showAll ? "/benchmarks?all" : "/benchmarks"}>
                <a className="link">
                  {!showAll ? "tous les" : "les plus récents"}
                </a>
              </Link>{" "}
              commits.
            </p>
            <div className="mt-12 pt-4">
              <h4 className="text-2xl font-bold tracking-tight">
                Mesures du temps d'exécution
              </h4>
              <p className="mt-2">
                Dans cette section, nous mesurons diverses métriques des scripts
                suivants:
              </p>
              <ul className="ml-8 list-disc my-2">
                <li>
                  <SourceLink
                    path="cli/tests/003_relative_import.ts"
                    name="cold_relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/text_decoder_perf.js"
                    name="text_decoder"
                  />
                </li>
                <li>
                  <SourceLink path="cli/tests/error_001.ts" name="error_001" />
                </li>
                <li>
                  <SourceLink path="cli/tests/002_hello.ts" name="cold_hello" />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/workers_round_robin_bench.ts"
                    name="workers_round_robin"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/003_relative_import.ts"
                    name="relative_import"
                  />
                </li>
                <li>
                  <SourceLink
                    path="cli/tests/workers_startup_bench.ts"
                    name="workers_startup"
                  />
                </li>
                <li>
                  <SourceLink path="cli/tests/002_hello.ts" name="hello" />
                </li>
              </ul>
              <div className="mt-8">
                <a href="#execution-time" id="execution-time">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Temps d'exécution
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                  yLabel="secondes"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Échelle logarithmique. Elle indique le temps total nécessaire
                  à l'exécution d'un script. Pour que deno puisse exécuter du
                  typescript, il doit d'abord le compiler en JS. Un démarrage à
                  chaud se produit lorsque deno a déjà une sortie JS en cache,
                  donc il doit être rapide car il contourne le compilateur TS.
                  Un démarrage à froid se produit lorsque deno doit compiler à
                  partir de zéro.
                </p>
              </div>
              <div className="mt-8">
                <a href="#thread-count" id="thread-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Nombre de threads
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.threadCount.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                />
                <p className="mt-1">
                  Combien de threads les différents programmes utilisent. Plus
                  c'est petit, mieux c'est.
                </p>
              </div>
              <div className="mt-8">
                <a href="#syscall-count" id="syscall-count">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Nombre d'appels système
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.syscallCount.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                />
                <p className="mt-1">
                  Le nombre total d'appels système effectués lors de l'exécution
                  d'un script donné. Plus c'est petit, mieux c'est.
                </p>
              </div>
              <div className="mt-8">
                <a href="#max-memory-usage" id="max-memory-usage">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Utilisation maximale de la mémoire
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxMemory.filter(
                    ({ name }) => !typescriptBenches.includes(name)
                  )}
                  yLabel="megaoctets"
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Utilisation maximale de la mémoire pendant l'exécution. Plus
                  c'est petit, mieux c'est.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">
                Performances de TypeScript
              </h4>
              <div className="mt-8">
                <a href="#type-checking" id="type-checking">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Vérification des types
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.execTime.filter(({ name }) => {
                    console.log(name);
                    return typescriptBenches.includes(name);
                  })}
                  yLabel="secondes"
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Dans les deux cas,{" "}
                  <code>std/examples/chat/server_test.ts</code> est mis en cache
                  par Deno. La charge de travail contient 20 modules TypeScript
                  uniques. Avec l'option <em>check</em> une vérification
                  complète des types TypeScript est effectuée, pendant que
                  l'option<em>no_check</em> utilise le flag{" "}
                  <code>--no-check</code> pour ignorer une vérification complète
                  des types. <em>bundle</em> effectue une vérification complète
                  du type et génère une sortie de fichier unique, tandis que{" "}
                  <em>bundle_no_check</em> utilise le flag{" "}
                  <code>--no-check</code> pour ignorer une vérification complète
                  des types.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">I/O</h4>
              <p
                className="mt-4 flex cursor-pointer"
                onClick={() => setShowNormalized(!showNormalized)}
              >
                <span
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={showNormalized ? "true" : "false"}
                  className={`${
                    showNormalized ? "bg-gray-900" : "bg-gray-200"
                  } relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      showNormalized ? "translate-x-5" : "translate-x-0"
                    } inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                  ></span>
                </span>
                <span className="ml-2 text-gray-900">
                  Afficher les benchmarks normalisés
                </span>
              </p>
              <div className="mt-8">
                <a href="#http-server-throughput" id="http-server-throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Débit du serveur HTTP
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={
                    showNormalized ? data?.normalizedReqPerSec : data?.reqPerSec
                  }
                  yLabel={showNormalized ? "% d'hyper débit" : "1k req/sec"}
                  yTickFormat={showNormalized ? formatPercentage : formatReqSec}
                />
                <p className="mt-1">
                  Teste les performances du serveur HTTP. 10 connexions
                  garder-connecter font autant de requêtes Hello-world que
                  possible. Plus c'est gros, mieux c'est.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <SourceLink path="tools/deno_tcp.ts" name="deno_tcp" /> est
                    un faux serveur http qui n'analyse pas HTTP. Il est
                    comparable à{" "}
                    <SourceLink path="tools/node_tcp.js" name="node_tcp" />
                  </li>
                  <li>
                    <SourceLink
                      path="std/http/http_bench.ts"
                      name="deno_http"
                    />{" "}
                    est un serveur Web écrit en TypeScript. Il est comparable à{" "}
                    <SourceLink path="tools/node_http.js" name="node_http" />
                  </li>
                  <li className="break-words">
                    deno_core_single et deno_core_multi sont deux versions d'un
                    faux serveur HTTP minimal. Il lit et écrit à l'aveugle des
                    paquets HTTP fixes. Il est comparable à deno_tcp et
                    node_tcp. Ceci est un exécutable autonome qui utilise{" "}
                    <a
                      className="link"
                      href="https://crates.io/crates/deno_core"
                    >
                      la crate rust de deno
                    </a>
                    . Le code est dans{" "}
                    <SourceLink
                      path="core/examples/http_bench.rs"
                      name="http_bench.rs"
                    />{" "}
                    et{" "}
                    <SourceLink
                      path="core/examples/http_bench.js"
                      name="http_bench.js"
                    />
                    . usage unique{" "}
                    <a
                      className="link"
                      href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.basic_scheduler"
                    >
                      tokio::runtime::Builder::basic_scheduler
                    </a>{" "}
                    et usages multiple{" "}
                    <a
                      className="link"
                      href="https://docs.rs/tokio/latest/tokio/runtime/struct.Builder.html#method.threaded_scheduler"
                    >
                      tokio::runtime::Builder::threaded_scheduler
                    </a>
                    .
                  </li>
                  <li>
                    <SourceLink
                      path="tools/hyper_hello/hyper_hello.rs"
                      name="hyper"
                    />{" "}
                    est un serveur HTTP Rust et représente une limite
                    supérieure.
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <a href="#http-latency" id="http-latency">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Latence HTTP
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.maxLatency}
                  yLabel={"millisecondes"}
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  La latence est maximale et est la même que le test précédent
                  sur les requêtes en seconde. Plus c'est petit, mieux c'est.
                  Échelle logarithmique.
                </p>
              </div>
              <div className="mt-8">
                <a href="#http-proxy-throughput" id="http-proxy-throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Débit du proxy HTTP
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={showNormalized ? data?.normalizedProxy : data?.proxy}
                  yLabel={showNormalized ? "% d'hyper débit" : "1k req/sec"}
                  yTickFormat={showNormalized ? formatPercentage : formatReqSec}
                />
                <p className="mt-1">
                  Teste les performances du proxy. 10 connexions
                  garder-connecter font autant de requêtes Hello-world que
                  possible. Plus c'est gros, mieux c'est.
                </p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <SourceLink
                      path="tools/deno_tcp_proxy.ts"
                      name="deno_proxy_tcp"
                    />{" "}
                    est un faux serveur proxy tcp qui n'analyse pas HTTP. Il est
                    comparable à{" "}
                    <SourceLink
                      path="tools/node_tcp_proxy.js"
                      name="node_proxy_tcp"
                    />
                  </li>
                  <li>
                    <SourceLink
                      path="tools/deno_http_proxy.ts"
                      name="deno_proxy"
                    />{" "}
                    est un serveur proxy HTTP écrit en TypeScript. Il est
                    comparable à{" "}
                    <SourceLink
                      path="tools/node_http_proxy.js"
                      name="node_proxy"
                    />
                  </li>
                  <li>
                    <SourceLink
                      path="tools/hyper_hello/hyper_hello.rs"
                      name="hyper"
                    />{" "}
                    est un serveur HTTP Rust utilisé comme origine des tests
                    proxy.
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <a href="#throughput" id="throughput">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Débit
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.throughput}
                  yLabel={"secondes"}
                  yTickFormat={formatLogScale}
                />
                <p className="mt-1">
                  Échelle logarithmique. Temps nécessaire pour acheminer une
                  certaine quantité de données via Deno.{" "}
                  <SourceLink
                    path="cli/tests/echo_server.ts"
                    name="echo_server.ts"
                  />{" "}
                  et <SourceLink path="cli/tests/cat.ts" name="cat.ts" />. Plus
                  c'est petit, mieux c'est.
                </p>
              </div>
            </div>
            <div className="mt-20">
              <h4 className="text-2xl font-bold tracking-tight">Size</h4>
              <div className="mt-8">
                <a href="#executable-size" id="executable-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Taille de l'exécutable
                  </h5>
                </a>
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.binarySize}
                  yLabel={"megaoctets"}
                  yTickFormat={formatMB}
                />
                <p className="mt-1">
                  Deno ne transporte qu'un seul binaire exécutable. Nous suivons
                  sa taille ici.
                </p>
              </div>
              <div className="mt-8">
                <a href="#bundle-size" id="bundle-size">
                  <h5 className="text-lg font-medium tracking-tight hover:underline">
                    Taille de la sortie
                  </h5>
                </a>{" "}
                <BenchmarkOrLoading
                  data={data}
                  columns={data?.bundleSize}
                  yLabel={"kilooctets"}
                  yTickFormat={formatKB}
                />
                <p className="mt-1">Taille des différents scripts groupés.</p>
                <ul className="ml-8 list-disc my-2">
                  <li>
                    <Link href="/std/http/file_server.ts">
                      <a className="link">file_server</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/std/examples/gist.ts">
                      <a className="link">gist</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer simple />
      </div>
    </>
  );
}

function BenchmarkOrLoading(props: {
  data: BenchmarkData | null;
  columns?: Column[];
  yLabel?: string;
  yTickFormat?: (n: number) => string;
}) {
  return props.data && props.columns ? (
    <BenchmarkChart
      columns={props.columns}
      sha1List={props.data.sha1List}
      yLabel={props.yLabel}
      yTickFormat={props.yTickFormat}
    />
  ) : (
    <BenchmarkLoading />
  );
}

function SourceLink({ name, path }: { name: string; path: string }) {
  return (
    <a
      href={`https://github.com/denoland/deno/blob/master/${path}`}
      className="link"
    >
      {name}
    </a>
  );
}

export default Benchmarks;
