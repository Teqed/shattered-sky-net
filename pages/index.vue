<script setup lang="ts">
import { ref, onMounted } from 'vue';

// --- Schema.org & Head ---
useSchemaOrg([
	defineBreadcrumb({
		"@type": "BreadcrumbList",
		"@id": "https://shatteredsky.net#breadcrumb",
		"itemListElement": [
			{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shatteredsky.net" },
			{ "@type": "ListItem", "position": 2, "name": "Files", "item": "https://shatteredsky.net/files" },
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
	meta: [{ name: 'description', content: 'Home page for Shattered Sky community.' }],
	link: [{ rel: 'me', href: 'https://mastodon.shatteredsky.net/@teq' }],
});

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
const art = [
	'<span class="motd-gray">┌─────────────────────────────┐</span>',
	'<span class="motd-gray"> ⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⣦⣤⣾⣿⠿⠛⣋⣥⣤⣀⠀⠀⠀⠀</span>',
	'<span class="motd-gray"> ⠀⠀⠀⠀⡤⡀⢈⢻⣬⣿⠟⢁⣤⣶⣿⣿⡿⠿⠿⠛⠛⢀⣄⠀</span>',
	'<span class="motd-gray"> ⠀⠀⢢⣘⣿⣿⣶⣿⣯⣤⣾⣿⣿⣿⠟⠁<span style="color:#fff";>⠄⠀⣾⡇</span>⣼⢻⣿⣾</span>',
	'<span class="motd-gray"> ⣰⠞⠛⢉⣩⣿⣿⣿⣿⣿⣿⣿⣿⠋<span style="color:#fff";>⣼⣧⣤⣴⠟</span>⣠⣿⢰⣿⣿</span>',
	'<span class="motd-gray"> ⣶⡾⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣄⣠⣤⡶⠟⢛⣩⣴⣿⣿⡟</span>',
	'<span class="motd-gray"> <span style="color:#fff";>⣠⣄⠈⠀⣰⡦</span>⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡛⠛⠛⠁</span>',
	'<span class="motd-gray"> <span style="color:#fff";>⠉⠛⠛⠛⠁</span>⡔⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠥⠀⠀</span>',
	'<span class="motd-gray"> ⣭⣏⣭⣭⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢠</span> ',
	'<span style="color:#fff";>     What\'s it all for?..<span class="blink">_</span></span>',
	'<span class="motd-gray">└─────────────────────────────┘</span>',
	'<span class="motd-gray">┌─────────────────────────────┐</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣏⣰⠛⢦⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠈⠷⠖⠾⢹⡄⠀⠀⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡏⠀⢀⡗⠦⡌⣷⠀⠀⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀⣞⡀⣀⣱⢻⣃⠀⣀⡀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⣤⠞⠛⠉⠁⠀⠀⠋⠁⢀⣀⣁⣉⠉⠉⣦⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠀⠀⣠⣬⣷⣶⢤⣴⣶⡶⠶⠒⠛⠛⠛⣻⣿⡟⠋⠁⠀⠀⠀</span>',
	'<span class="motd-gray"> ⠿⠿⣶⣤⣾⣿⣿⣿⣿⠘⠟⠋<span style="color:#fff";>⠀⣤⠀⠀⠀⠶</span>⠈⠛⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠘⢛⣿⣿⣿⣿⣿⣆⡀⠀<span style="color:#fff";>⠀⠀</span>⠀⠀⠀⠀⣧⣄⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-gray">⠀⠀⠀⠀⠈⠓⠚⠊⠀⠀⠀⠹⣳⢶⣖⡍⠉⠉⠹⠽⠚⠀⠀⠀⠀⠀⠀</span>',
	'<span style="color:#fff";>         born to dance</span>',
	'<span class="motd-gray">└─────────────────────────────┘</span>',
	'<span class="motd-gray">┌─────────────────────────────┐</span>',
	'',
	'<span class="motd-gray">          made by <span style="color:#fff";>teq</span></span>',
	'<span class="motd-gray">          <a href=/bio>more of me</a></span>',
	'',
	'<span class="motd-gray">└─────────────────────────────┘</span>',
];
const motdLines = [
	'<span class="motd-gray">┌────── Welcome to <span style="color:#ffffff;">SHATTERED SKY</span> ──────┐</span>',
	'<span style="color:#e06c75;"> OS</span>: <a class="inline-a" href="https://nixos.org/">NixOS 25.11 (Xantusia) x86_64</a>     ',
	'<span style="color:#e06c75;"> Kernel</span>: <a class="inline-a" href="https://cachyos.org/">Linux 6.14.7-cachyos</a>          ',
	'<span style="color:#e06c75;"> Fetched</span>: 2025-06-30 22:44:13 EDT      ',
	'<span style="color:#e06c75;"> Locale</span>: en_US.UTF-8                   ',
	'<span class="motd-gray">└──────────────────────────────────────┘</span>',
	'<span class="motd-gray">┌────────────── <span style="color:#fff";>Terminal</span> ──────────────┐</span>',
	'<span style="color:#e5c07b;"> Shell</span>: <a class="inline-a" href=https://fishshell.com/>fish 4.0.2</a>                     ',
	'<span style="color:#e5c07b;"> Terminal</span>: <a class="inline-a" href="https://ghostty.org/">ghostty 1.1.4</a>               ',
	'<span style="color:#e5c07b;">󱞎 Multiplexer</span>: <a class="inline-a" href="https://zellij.dev/">zellij 0.42.2</a>            ',
	'<span style="color:#e5c07b;"> Font</span>: <a class="inline-a" href="https://www.nerdfonts.com/font-downloads">JetBrainsMono Nerd Font</a>         ',
	'<span class="motd-gray">└──────────────────────────────────────┘</span>',
	'<span class="motd-gray">┌────────────── <span style="color:#fff";>Desktop</span> ───────────────┐</span>',
	'<span style="color:#98c379;"> Font</span>: <a class="inline-a" href="https://fonts.google.com/specimen/Inter">Inter</a>                           ',
	'<span style="color:#98c379;">󱞎 Editor</span>: <a class="inline-a" href="https://zed.dev/">Zed 0.188.0</a>                   ',
	'<span style="color:#98c379;"> Session</span>: <a class="inline-a" href="https://kde.org/plasma-desktop/">KDE Plasma (Wayland)</a>         ',
	'<span style="color:#98c379;">󰍹 Display</span>: 2560x1440,1920x1080 @ 144Hz  ',
	'<span class="motd-gray">└──────────────────────────────────────┘</span>',
	'<span class="motd-gray">┌───────────── <span style="color:#fff";>Development</span> ────────────┐</span>',
	'<span style="color:#61afef;"> Go</span>: <a class="inline-a" href="https://go.dev/doc/devel/release">go 1.24.3</a>                         ',
	'<span style="color:#61afef;"> Rust</span>: <a class="inline-a" href="https://www.rust-lang.org/">rustc 1.88.0</a>                    ',
	'<span style="color:#61afef;"> Python</span>: <a class="inline-a" href="https://www.python.org/">python 3.13.5</a>                ',
	'<span style="color:#61afef;">󰈙 JavaScript</span>: <a class="inline-a" href="https://nodejs.org/">node.js 24.3.0</a>            ',
	'<span class="motd-gray">└──────────────────────────────────────┘</span>',
	'<span class="motd-gray">┌────────────── <span style="color:#fff";>Hardware</span> ──────────────┐</span>',
	'<span style="color:#c678dd;"> CPU</span>: <a class="inline-a" href="https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-3000-series/amd-ryzen-5-3600.html#amd_support_product_spec">AMD Ryzen 5 3600 @ 4.21 GHz</a>      ',
	'<span style="color:#c678dd;">󰾲 GPU</span>: <a class="inline-a" href="https://www.amd.com/en/support/downloads/drivers.html/graphics/radeon-rx/radeon-rx-5000-series/amd-radeon-rx-5700.html#amd_support_product_spec">AMD Radeon RX 5700</a>               ',
	'<span style="color:#c678dd;"> RAM</span>: 24 GiB / 32 GiB (76%)            ',
	'<span style="color:#c678dd;"> Disk</span>: 453 GiB / 558 GiB (81%) <a class="inline-a" href="https://btrfs.readthedocs.io/en/latest/">btrfs</a>   ',
	'<span class="motd-gray">└──────────────────────────────────────┘</span>',
	'<span style="padding-left:2ch;">' +
	'<span style="color:#e06c75;">●</span> ' +
	'<span style="color:#e5c07b;">●</span> ' +
	'<span style="color:#98c379;">●</span> ' +
	'<span style="color:#56b6c2;">●</span> ' +
	'<span style="color:#61afef;">●</span> ' +
	'<span style="color:#c678dd;">●</span>' +
	'</span>',
];

// --- State ---
const displayedLines = ref<string[]>([]);
const motdDisplayedLines = ref<string[]>([]);
const showMotd = ref(false);

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
	await showMotdAnimated();
}

// --- MOTD Animation ---
async function showMotdAnimated() {
	await new Promise(resolve => setTimeout(resolve, 2000));
	displayedLines.value = [];
	showMotd.value = true;
	for (const line of motdLines) {
		motdDisplayedLines.value.push(line);
		await new Promise(resolve => setTimeout(resolve, 20));
	}
}

// --- Lifecycle ---
onMounted(() => {
	const width = ref(window.innerWidth).value;
	if (width > 780) {
		const prompt = '<span class="starship-bg-red-sep"></span><span class="starship-bg-red"> </span><span class="starship-bg-orange-sep"></span><span class="starship-bg-orange"> teq@shatteredsky </span><span class="starship-bg-yellow-sep"></span><span class="starship-bg-yellow"> ~ </span><span class="starship-bg-green-light-sep"></span><span class="starship-bg-green-light"> </span><span class="starship-bg-green-sep"></span><span class="starship-bg-green"> </span><span class="starship-bg-aqua-sep"></span><span class="starship-bg-aqua">  main </span><span class="starship-bg-blue-sep"></span><span class="starship-bg-blue"> </span><span class="starship-bg-purple-sep"></span><span class="starship-bg-purple">  v24.3.0 </span><span class="starship-bg3-sep"></span><span class="starship-bg3"> fish </span><span class="starship-bg1-sep"></span><span class="starship-bg1">  22:44 </span><span class="starship-bg1-sep-2"></span>';
		const promptElement = document.querySelector('.prompt');
		if (promptElement) {
			promptElement.innerHTML = prompt ? prompt : '';
		}
		for (let i = 0; i < art.length; i++) {
			motdLines[i] += `  ${art[i]}`;
		}
	} else {
		const prompt = '<span class="starship-bg-red-sep"></span><span class="starship-bg-red"> </span><span class="starship-bg-orange-sep"></span><span class="starship-bg-orange"> teq@shatteredsky </span><span class="starship-bg-yellow-sep"></span><span class="starship-bg-yellow"> ~ </span><span class="starship-bg-green-light-sep"></span><span class="starship-bg-green-light"> </span><span class="starship-bg-green-sep"></span><span class="starship-bg-green"> </span><span class="starship-bg-aqua-sep"></span><span class="starship-bg-aqua"></span><span class="starship-bg-blue-sep"></span><span class="starship-bg-blue"></span><span class="starship-bg-purple-sep"></span><span class="starship-bg-purple"></span><span class="starship-bg3-sep"></span><span class="starship-bg3"></span><span class="starship-bg1-sep"></span><span class="starship-bg1">  22:44 </span><span class="starship-bg1-sep-2"></span>';
		const promptElement = document.querySelector('.prompt');
		if (promptElement) {
			promptElement.innerHTML = prompt ? prompt : '';
		}
		motdLines.push(...art);
	}
	typeLines(terminalLines);
});
</script>

<template>
	<div>
		<FakeCRT>
			<div class="prompt"></div>
			<template v-for="(line, idx) in displayedLines" :key="idx">
				<p>{{ line }}</p>
			</template>
			<div v-if="showMotd" class="motd-pre" style="margin-top: 1.5em;">
				<pre v-for="(line, idx) in motdDisplayedLines" :key="idx" v-html="line"></pre>
			</div>
		</FakeCRT>
	</div>
</template>


<style>
@keyframes cursor-blink {
	0% {
		opacity: 0;
	}
}

.blink {
	animation: cursor-blink 1.5s steps(2) infinite;
}

.inline-a {
	text-decoration: none;
	color: inherit;
}

.crt {
	font-family: 'JetBrainsMono Nerd Font', 'Fira Mono', 'Consolas', 'Menlo', monospace;
}

.motd-gray {
	color: #888;
}

.motd-green {
	color: #7ec699;
}

.motd-yellow {
	color: #e5c07b;
}

.motd-blue {
	color: #61afef;
}

.motd-magenta {
	color: #c678dd;
}

.motd-bold {
	font-weight: bold;
}

.motd-pre {
	font-family: 'JetBrainsMono Nerd Font', 'Fira Mono', 'Consolas', 'Menlo', monospace;
	font-size: 1em;
}

/* Starship prompt colors and styles */
@font-face {
	font-family: 'JetBrainsMono Nerd Font';
	src: url('/assets/fonts/JetBrainsMonoNerdFontMono-Regular.ttf') format('truetype');
	font-display: swap;
}

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
