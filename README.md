# deno_website2_fr

[![Build Status](https://github.com/denoland/deno_website2/workflows/ci/badge.svg?branch=master&event=push)](https://github.com/denoland/deno_website2/actions)

Ceci est le code pour https://deno.land/

Ce site Web se compose de deux parties

1. Un Worker Cloudflare
2. Une application Next.js hébergée sur Vercel

Nous voulons fournir de jolies URL sémantiques pour les modules qui seront
utilisés dans Deno. Par exemple: https://deno.land/std/http/server.ts

Lorsque nous demandons ce fichier à l'intérieur de Deno, nous devons recevoir le
contenu brut du fichier. Cependant, lorsque nous visitons cette URL dans le
navigateur, nous voulons voir un joli fichier HTML avec coloration syntaxique.

Pour ce faire, le Worker Cloudflare examine l'en-tête HTTP "Accept:" pour voir
si le client veut du HTML ou non. S'il veut du HTML, nous transmettons
simplement la demande à Vercel. (Nous utilisons Vercel en raison de leur belle
intégration GitHub.)

## Histoire

Ceci est une réécriture du site Web Deno, il combinera le code dans
https://github.com/denoland/deno/tree/f96aaa802b245c8b3aeb5d57b031f8a55bb07de2/website
et https://github.com/denoland/registry et aura un déploiement plus rapide.

Ceci est écrit via React / TailwindCSS / Vercel / CloudFlare Workers. Pas en
Deno. Idéalement, cela pourrait être porté à Deno à un moment donné, mais nous
avons besoin d'un nouveau site Web et la version portée sur Deno prend trop de
temps. Nous espérons voir ce code porté sur Deno avec un minimum d'interruptions
dans le flux de développement (en particulier, nous avons besoin de la capacité
d'écouter les événements du système de fichiers et de recharger le serveur Web).

## Licence d'images

Ces images Deno sont distribuées sous licence MIT (domaine public et utilisation
gratuite).

- [Un graphique pour le blog v1 par @hashrock](https://deno.land/v1.jpg)
