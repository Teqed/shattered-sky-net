<script setup lang="ts">
useSchemaOrg([
  defineBreadcrumb({
            "@type":"BreadcrumbList",
            "@id":"https://shatteredsky.net#breadcrumb",
            "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://shatteredsky.net"
                },{
                "@type": "ListItem",
                "position": 2,
                "name": "Files",
                "item": "https://shatteredsky.net/files"
                },{
                "@type": "ListItem",
                "position": 3,
                "name": "Tabletop",
                "item": "https://shatteredsky.net/tabletop"
                },{
                "@type": "ListItem",
                "position": 4,
                "name": "Stream",
                "item": "https://shatteredsky.net/stream"
                },{
                "@type": "ListItem",
                "position": 5,
                "name": "Social",
                "item": "https://shatteredsky.net/social"
                },{
                "@type": "ListItem",
                "position": 6,
                "name": "About",
                "item": "https://shatteredsky.net/about"
                }
            ]
        }),
  defineWebPage({
            "@type": "WebPage",
            "@id":"https://shatteredsky.net#webpage",
            "url":"https://shatteredsky.net",
            "name":"Shattered Sky",
            "isPartOf":{
                "@id":"https://shatteredsky.net#website"
            },
            "author":{
                "@id":"https://quilling.dev#person"
            },
            "about":{
                "@id":"https://shatteredsky.net#organization"
            },
            "datePublished":"2024-03-06T05:30:13+0000",
            "dateModified":"2024-03-06T05:30:13+0000",
            "description":"The hosting platform of Shattered Sky, a digital community.",
            "breadcrumb":{
                "@id":"https://shatteredsky.net#breadcrumb"
            },
            "inLanguage":"en-US, zh-CN, fr-FR",
            "potentialAction":[{
                "@type":"ReadAction",
                "target":["https://shatteredsky.net"]
            }]
        }),
  defineWebSite({
            "@type":"WebSite",
            "@id":"https://shatteredsky.net#website",
            "url":"https://shatteredsky.net",
            "name":"Shattered Sky",
            "description":"Homepage for Shattered Sky",
            "publisher":{
                "@id":"https://quilling.dev#person"
            },
            "potentialAction":[{
                "@type":"SearchAction",
                "target":{
                    "@type":"EntryPoint",
                    "urlTemplate":"https://shatteredsky.net/?s={search_term_string}"
                },
                "query-input":"required name=search_term_string"
            }],
            "inLanguage":"en-US"
        }),
  defineOrganization({
            "@type":"Organization",
            "@id":"https://shatteredsky.net#organization",
            "name":"Shattered Sky",
            "url":"https://shatteredsky.net",
            "logo":"https://shatteredsky.net/assets/images/logo.png",
            "founder":{
                "@type":"Person",
                "@id":"https://quilling.dev#person"
            },
            "member":{
                "@type":"Person",
                "@id":"https://quilling.dev#person"
            },
            "subjectOf":{
                "@id":"https://shatteredsky.net#website"
            }
        }),
]);
useHead({
	title: 'Shattered Sky',
	titleTemplate: '%s',
	meta: [
		{
			name: 'description',
			content: 'Home page for Shattered Sky community.',
		},
	],
	link: [
		{
			rel: 'me',
			href: 'https://mastodon.shatteredsky.net/@teq',
		},
	],
});
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:file-document-multiple-outline text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.files.title') }}
			</template>

			<i18n-t
				keypath="index.files.blurb"
				scope="global"
				for="index.files.linkText"
			>
				<a
					href="https://files.shatteredsky.net/"
					target="_blank"
					rel="noopener"
					>{{ $t('index.files.linkText') }}</a
				>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:dice-d20-outline text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.tabletop.title') }}
			</template>

			<i18n-t
				keypath="index.tabletop.blurb"
				scope="global"
				for="index.tabletop.linkText"
			>
				<RouterLink to="/tabletop">
					{{ $t('index.tabletop.linkText') }}
				</RouterLink>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:youtube-tv text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.streaming.title') }}
			</template>

			<i18n-t
				keypath="index.streaming.blurb"
				scope="global"
				for="index.streaming.linkText"
			>
				<a
					href="https://plex.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.streaming.linkText') }}
				</a>
				<a
					href="https://jellyfin.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.streaming.linkText2') }}
				</a>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:forum text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.social.title') }}
			</template>

			<i18n-t
				keypath="index.social.blurb"
				scope="global"
				for="index.social.linkText"
			>
				<a
					href="https://en.wikipedia.org/wiki/Fediverse"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.social.linkText') }}
				</a>
				<a
					href="https://mastodon.shatteredsky.net/"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.social.linkText2') }}
				</a>
			</i18n-t>
		</TileItem>

		<TileItem>
			<template #icon>
				<div class="i-mdi:playlist-check text-2xl" />
			</template>
			<template #heading>
				{{ $t('index.whitelisting.title') }}
			</template>

			<i18n-t
				keypath="index.whitelisting.blurb"
				scope="global"
				for="index.whitelisting.linkText"
			>
				<a
					href="https://discord.gg/VaWPCXr"
					target="_blank"
					rel="noopener"
				>
					{{ $t('index.whitelisting.linkText') }}
				</a>
			</i18n-t>
		</TileItem>
	</div>
</template>
