import React from 'react'
import Head from 'next/head'

const DocumentHead = ({ title, description, img }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href="https://reebelo-demo.vercel.app/" />
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      {img && <meta property="og:image" content={img} />}
      <meta property="og:url" content="PERMALINK" />
      <meta property="og:site_name" content="Reebelo Demo" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {img && <meta name="twitter:image" content={img} /> }
      <meta name="twitter:site" content="@iiisoni" />
      <meta name="twitter:creator" content="@iiisoni" />
    </Head>
  )
}

export default DocumentHead
