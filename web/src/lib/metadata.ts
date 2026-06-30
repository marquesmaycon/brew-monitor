const APP_NAME = 'Brew Monitor'
const DEFAULT_DESCRIPTION =
  'Monitore lotes, tanques, cervejas e registros fermentativos em um unico painel.'

type MetadataOptions = {
  title?: string
  description?: string
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
}: MetadataOptions = {}) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]
}
