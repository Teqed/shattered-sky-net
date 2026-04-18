<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// --- Schema.org & Head ---
useSchemaOrg([
	defineBreadcrumb({
		"@type": "BreadcrumbList",
		"@id": "https://shatteredsky.net#breadcrumb",
		"itemListElement": [
			{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shatteredsky.net" },
			{ "@type": "ListItem", "position": 2, "name": "Cloud", "item": "https://shatteredsky.net/cloud" },
			{ "@type": "ListItem", "position": 3, "name": "Tabletop", "item": "https://shatteredsky.net/tabletop" },
			{ "@type": "ListItem", "position": 4, "name": "Blog", "item": "https://shatteredsky.net/blog" },
			{ "@type": "ListItem", "position": 5, "name": "About", "item": "https://shatteredsky.net/about" }
		]
	}),
	defineWebPage({
		"@type": "WebPage",
		"@id": "https://shatteredsky.net#webpage",
		"url": "https://shatteredsky.net",
		"name": "Shattered Sky",
		"isPartOf": { "@id": "https://shatteredsky.net#website" },
		"author": { "@id": "https://quilling.dev#person" },
		"about": { "@id": "https://shatteredsky.net#organization" },
		"datePublished": "2024-03-07",
		"dateModified": "2024-03-07",
		"description": "The hosting platform of Shattered Sky, a digital community.",
		"breadcrumb": { "@id": "https://shatteredsky.net#breadcrumb" },
		"inLanguage": "en-US, zh-CN, fr-FR",
		"potentialAction": [{ "@type": "ReadAction", "target": ["https://shatteredsky.net"] }]
	}),
	defineWebSite({
		"@type": "WebSite",
		"@id": "https://shatteredsky.net#website",
		"url": "https://shatteredsky.net",
		"name": "Shattered Sky",
		"description": "Homepage for Shattered Sky",
		"publisher": { "@id": "https://quilling.dev#person" },
		"potentialAction": [{
			"@type": "SearchAction",
			"target": { "@type": "EntryPoint", "urlTemplate": "https://shatteredsky.net/?s={search_term_string}" },
			"query-input": "required name=search_term_string"
		}],
		"inLanguage": "en-US"
	}),
	defineOrganization({
		"@type": "Organization",
		"@id": "https://shatteredsky.net#organization",
		"name": "Shattered Sky",
		"url": "https://shatteredsky.net",
		"logo": "https://shatteredsky.net/assets/images/logo.png",
		"founder": { "@type": "Person", "@id": "https://quilling.dev#person" },
		"member": { "@type": "Person", "@id": "https://quilling.dev#person" },
		"subjectOf": { "@id": "https://shatteredsky.net#website" }
	}),
]);
useHead({
	title: 'Shattered Sky',
	titleTemplate: '%s',
	meta: [{ name: 'description', content: 'Located in Jupiter\'s satellite system 204-Callisto, positioned at Aphelion 3.13704 AU, consuming 70mW...' },
		{ name: 'og:image', content: 'https://shatteredsky.net/og-image.jpg' },
	],
	link: [{ rel: 'me', href: 'https://mastodon.shatteredsky.net/@teq' }, { rel: 'me', href: 'https://bsky.app/profile/quilling.dev' }],
});
// defineOgImageScreenshot({})

// --- Types ---
type TerminalLine = {
	text: string;
	delay: number;
	type?: 'char' | 'line' | 'dots';
	charDelay?: number;
	dotDelay?: number;
	delays?: number[];
};

// --- Constants ---
const today_date = new Date();
const terminalLines: TerminalLine[] = [
	{
		text: ' ssh shatteredsky.net:22',
		delay: 0,
		type: 'char',
		delays: [0, 400, 150, 75, 150, 300, 150, 120, 140, 160, 60, 80, 60, 90, 70, 60, 80, 100, 200, 60, 90, 200, 500, 120, 50, 1200]
	},
	{
		text: `Running on Linux 6.14.7-cachyos NixOS ${today_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
		delay: 150,
		type: 'line'
	},
	{ text: 'Reading configuration data ...', delay: 70, type: 'dots', dotDelay: 300 },
	{ text: 'Applying options for *', delay: 45, type: 'line' },
	{ text: "Executing command: '/bin/bash'", delay: 55, type: 'line' },
	{ text: "Connecting to shatteredsky.net port 22 ...", delay: 300, type: 'dots', dotDelay: 750 },
	{ text: "Connection established.", delay: 200, type: 'line' },
	{ text: "Welcome to SHATTERED SKY", delay: 600, type: 'line' },
];

// --- State ---
const displayedLines = ref<string[]>([]);
const showMotdCookie = useCookie<boolean>('showMotd', { default: () => false, maxAge: 60 });
const showMotd = ref(showMotdCookie.value);
watch(showMotd, (val) => {
  showMotdCookie.value = val;
});

// --- Terminal Animation Helpers ---
async function typeLineCharByChar(text: string, charDelay: number, delays?: number[]) {
	let current = '';
	for (let i = 0; i < text.length; i++) {
		current += text[i];
		if (i === 0) {
			displayedLines.value.push(current);
		} else {
			displayedLines.value[displayedLines.value.length - 1] = current;
		}
		const delay = delays && delays[i] !== undefined ? delays[i] : charDelay;
		await new Promise(resolve => setTimeout(resolve, delay));
	}
}
async function typeLineWithAnimatedDots(text: string, dotDelay: number) {
	const dotMatch = text.match(/(\.{2,})$/);
	if (dotMatch) {
		const dots = dotMatch[0];
		const base = text.slice(0, -dots.length);
		displayedLines.value.push(base);
		let current = base;
		await new Promise(resolve => setTimeout(resolve, dotDelay));
		for (let i = 0; i < dots.length; i++) {
			current += dots[i];
			displayedLines.value[displayedLines.value.length - 1] = current;
			await new Promise(resolve => setTimeout(resolve, dotDelay));
		}
	} else {
		displayedLines.value.push(text);
	}
}
async function typeLines(lines: TerminalLine[]) {
	if (showMotd.value == false) {
		for (const line of lines) {
			await new Promise(resolve => setTimeout(resolve, line.delay));
			if (line.type === 'char') {
				await typeLineCharByChar(line.text, line.charDelay ?? 40, line.delays);
			} else if (line.type === 'dots') {
				await typeLineWithAnimatedDots(line.text, line.dotDelay ?? 300);
			} else {
				displayedLines.value.push(line.text);
			}
		}
	}
	await showMotdAnimated();
}

// --- MOTD Animation ---
async function showMotdAnimated() {
	await new Promise(resolve => setTimeout(resolve, 1100));
	displayedLines.value = [];
	showMotd.value = true;
}

// --- Lifecycle ---
onMounted(() => {
	typeLines(terminalLines);
});
</script>

<template>
	<div class="landing">
		<FakeCRT>
			<div class="prompt"><span class="starship-bg-red-sep"></span><span class="starship-bg-red"> </span><span
					class="starship-bg-orange-sep"></span><span class="starship-bg-orange"> teq@shatteredsky
				</span><span class="starship-bg-yellow-sep"></span><span class="starship-bg-yellow"> ~ </span><span
					class="starship-bg-green-light-sep"></span><span class="starship-bg-green-light">⠀</span><span
					class="starship-bg-green-sep"></span><span class="starship-bg-green">⠀</span><span
					class="starship-bg-aqua-sep"></span><span class="starship-bg-aqua">  main </span><span
					class="starship-bg-blue-sep"></span><span class="starship-bg-blue">⠀</span><span
					class="starship-bg-purple-sep"></span><span class="starship-bg-purple">  v24.3.0 </span><span
					class="starship-bg3-sep"></span><span class="starship-bg3"> fish </span><span
					class="starship-bg1-sep"></span><span class="starship-bg1">  22:44 </span><span
					class="starship-bg1-sep-2"></span></div>
			<template v-for="(line, idx) in displayedLines" :key="idx">
				<p class="fakelogin">{{ line }}</p>
			</template>
			<MotdLine v-if="showMotd" />
		</FakeCRT>
	</div>
</template>


<style>
@keyframes cursor-blink {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 1;
	}

	75% {
		opacity: 0;
	}

	100% {
		opacity: 0;
	}
}

.blink {
	color: #fff;
	animation: cursor-blink 1.5s infinite;
}

.inline-a {
	text-shadow: 1.870905614848819px 0 1px rgba(0, 30, 255, 0.25), -1.870905614848819px 0 1px rgba(255, 0, 80, 0.3), 0 0 3px;
	text-decoration: none;
	color: inherit;
	animation: fadein 1s ease-in-out;
	font-family: 'JetBrainsMono Nerd Font Mono', monospace;
}

.inline-a:hover {
	text-decoration: underline;
	color: #fff;
	background: none !important;
	transition: color 0.3s ease;
}



@keyframes fadein {
	from {
		opacity: 0.1;
		filter: blur(5px);
	}

	to {
		opacity: 1;
		filter: blur(0);
	}
}

.landing {
	animation: fadein 0.1s ease-in-out;
}

.prompt {
	animation: fadein 0.1s ease-in-out;
	font-family: 'JetBrainsMono Nerd Font Mono', monospace;
}

.fakelogin {
	animation: fadein 0.1s ease-in-out;
	font-family: 'JetBrainsMono Nerd Font Mono', monospace;
}

/* Starship prompt colors and styles */

/* Segment backgrounds */
.starship-bg-red-sep {
	text-shadow: none;
	color: #c1121c;
}

.starship-bg-orange-sep {
	text-shadow: none;
	background: #ff924c;
	color: #c1121c;
}

.starship-bg-yellow-sep {
	text-shadow: none;
	background: #ffca3a;
	color: #ff924c;
}

.starship-bg-green-light-sep {
	text-shadow: none;
	background: #c5ca30;
	color: #ffca3a;
}

.starship-bg-green-sep {
	text-shadow: none;
	background: #8ac926;
	color: #c5ca30;
}

.starship-bg-aqua-sep {
	text-shadow: none;
	background: #689d6a;
	color: #8ac926;
}

.starship-bg-blue-sep {
	text-shadow: none;
	background: #1982c4;
	color: #689d6a;
}

.starship-bg-purple-sep {
	text-shadow: none;
	background: #7f62a9;
	color: #1982c4;
}

.starship-bg3-sep {
	text-shadow: none;
	background: #54585a;
	color: #7f62a9;
}

.starship-bg1-sep {
	text-shadow: none;
	background: #3c3836;
	color: #54585a;
}

.starship-bg1-sep-2 {
	text-shadow: none;
	color: #3c3836;
}

.starship-bg-red {
	background: #c1121c;
	color: #fbf1c7;
}


.starship-bg-orange {
	background: #ff924c;
	color: #3c3836;
}

.starship-bg-yellow {
	background: #ffca3a;
	color: #3c3836;
}

.starship-bg-green-light {
	background: #c5ca30;
	color: #3c3836;
}

.starship-bg-green {
	background: #8ac926;
	color: #3c3836;
}

.starship-bg-aqua {
	background: #689d6a;
	color: #3c3836;
}

.starship-bg-blue {
	background: #1982c4;
	color: #fbf1c7;
}

.starship-bg-blue-dark {
	background: #4267ac;
	color: #fbf1c7;
}

.starship-bg-purple {
	background: #7f62a9;
	color: #fbf1c7;
}

.starship-bg-purple-light {
	background: #b5a6c9;
	color: #3c3836;
}

.starship-bg3 {
	background: #54585a;
	color: #fbf1c7;
}

.starship-bg1 {
	background: #3c3836;
	color: #fbf1c7;
}

/* Foreground only */
.starship-fg0 {
	color: #fbf1c7;
}

.starship-blue {
	color: #00387b;
}

.starship-green {
	color: #98971a;
}

.starship-orange {
	color: #d65d0e;
}

.starship-purple {
	color: #cb89a7;
}

.starship-red {
	color: #cc241d;
}

.starship-yellow {
	color: #d79921;
}

.starship-aqua {
	color: #689d6a;
}

.starship-bold {
	font-weight: bold;
}
</style>
