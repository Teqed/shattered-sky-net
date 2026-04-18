<template>
		<pre
			v-for="(line, idx) in displayedLines"
			:key="idx"
			class="motd-line"
			v-html="line"
		/>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const displayedLines = ref([])

const motdLines = [
	'<span class="motd-gray">┌─ Welcome to <span class="motd-white">SHATTERED SKY</span> ──┐</span>' + '<span class="motd-gray">┌─────────────────────────────┐</span>',
	'<span class="motd-red"> OS</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://nixos.org/">NixOS 25.11 (Xantusia)</a>   ' + '<span class="motd-gray"> ⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⣦⣤⣾⣿⠿⠛⣋⣥⣤⣀⠀⠀⠀⠀</span>',
	'<span class="motd-red"> Kernel</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://cachyos.org/">Linux 6.14.7-cachyos</a> ' + '<span class="motd-gray"> ⠀⠀⠀⠀⡤⡀⢈⢻⣬⣿⠟⢁⣤⣶⣿⣿⡿⠿⠿⠛⠛⢀⣄⠀</span>',
	'<span class="motd-red"> Fetched</span>: 2025-06-30 22:44 ET ' + '<span class="motd-gray"> ⠀⠀⢢⣘⣿⣿⣶⣿⣯⣤⣾⣿⣿⣿⠟⠁<span class="motd-white">⠄⠀⣾⡇</span>⣼⢻⣿⣾</span>',
	'<span class="motd-gray">└─────────────────────────────┘</span>' + '<span class="motd-gray"> ⣰⠞⠛⢉⣩⣿⣿⣿⣿⣿⣿⣿⠋<span class="motd-white">⣼⣧⣤⣴⠟</span>⣠⣿⢰⣿⣿</span>',
	'<span class="motd-gray">┌───────── <span class="motd-white">Terminal</span> ──────────┐</span>' + '<span class="motd-gray"> ⣶⡾⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣄⣠⣤⡶⠟⢛⣩⣴⣿⣿⡟</span>',
	'<span class="motd-yellow"> Shell</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://fishshell.com/">fish 4.0.2</a>             ' + '<span class="motd-gray"><span class="motd-white">⣠⣄⠈⠀⣰⡦</span>⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡛⠛⠛⠁</span>',
	'<span class="motd-yellow"> Terminal</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://ghostty.org/">ghostty 1.1.4</a>      ' + '<span class="motd-gray"> <span class="motd-white">⠉⠛⠛⠛⠁</span>⡔⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠥⠀⠀</span>',
	'<span class="motd-yellow">󱞎 Multiplexer</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://zellij.dev/">zellij 0.42.2</a>   ' + '<span class="motd-gray"> ⣭⣏⣭⣭⣥⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢠</span>',
	'<span class="motd-yellow"> Font</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://www.nerdfonts.com/font-downloads">JetBrainsMono NerdFont</a> <span class="motd-white">     What\'s it all for?..<span class="blink">_</span></span>',
	'<span class="motd-gray">└─────────────────────────────┘</span><span class="motd-gray">└─────────────────────────────┘</span>',
	'<span class="motd-gray">┌────────── <span class="motd-white">Desktop</span> ──────────┐</span><span class="motd-gray">┌─────────────────────────────┐</span>',
	'<span class="motd-green"> Font</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://fonts.google.com/specimen/Inter">Inter</a>                  <span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣏<span class="motd-white">⣰⠛⢦</span>⣿⠀⠀⠀⠀⠀⠀</span>',
	'<span class="motd-green">󱞎 Editor</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://zed.dev/">Zed 0.188.0</a>          <span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸<span class="motd-white">⠈⠷⠖⠾</span>⢹⡄⠀⠀⠀⠀⠀</span>',
	'<span class="motd-green"> Session</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://kde.org/plasma-desktop/">KDE Plasma Wayland  </a><span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡏⠀<span class="motd-white">⢀⡗⠦⣄</span>⣷⠀⠀⠀⠀⠀</span>',
	'<span class="motd-green">󰍹 Display</span>: 2560x1440,1920x1080 <span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡇⠀<span class="motd-white">⣞⡀⣀⣱</span>⢻⣃⠀⣀⡀⠀</span>',
	'<span class="motd-gray">└─────────────────────────────┘</span><span class="motd-gray">⠀⠀⠀⠀⠀⠀⠀⠀⣤⠞⠛⠉⠁⠀⠀<span class="motd-white">⠋⠁</span>⢀⣀⣁⣉⠉⣦</span>',
	'<span class="motd-gray">┌──────── <span class="motd-white">Development</span> ────────┐</span><span class="motd-gray">⠀⠀⠀⠀⠀⠀⣠⣬⣷⣶⢤⣴⣶⡶⠶⠒⠛⠛⠛⣻⣿⡟⠋⠁</span>',
	'<span class="motd-blue"> Go</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://go.dev/doc/devel/release">go 1.24.3</a>                <span class="motd-gray">⠀⠿⠿⣶⣤⣾⣿⣿⣿⣿⠘⠟⠋⠀⣤⠀⠀⠀⠶⠈⠛   </span>',
	'<span class="motd-blue"> Rust</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://www.rust-lang.org/">rustc 1.88.0</a>           <span class="motd-gray">⠀⠀⠀⠘⢛⣿⣿⣿⣿⣿⣆⡀⠀⠀⠀⠀⠀⠀⠀⣧⣄⠀⠀⠀</span>',
	'<span class="motd-blue"> Python</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://www.python.org/">python 3.13.5</a>        <span class="motd-gray">⠀⠀⠀⠀⠈⠓⠚⠊⠀⠀⠀⠹⣳⢶⣖⡍⠉⠉⠹⠽⠚⠀⠀⠀</span>',
	'<span class="motd-blue">󰈙 JavaScript</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://nodejs.org/">node.js 24.3.0</a>   <span class="motd-white">         born to dance        ⠀</span>',
	'<span class="motd-gray">└─────────────────────────────┘</span><span class="motd-gray">└─────────────────────────────┘</span>',
	'<span class="motd-gray">┌───────── <span class="motd-white">Hardware</span> ──────────┐</span><span class="motd-gray">┌─────────────────────────────┐</span>',
	'<span class="motd-magenta"> CPU</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://www.amd.com/en/support/downloads/drivers.html/processors/ryzen/ryzen-3000-series/amd-ryzen-5-3600.html#amd_support_product_spec">AMD Ryzen 5 3600</a>',
	'<span class="motd-magenta">󰾲 GPU</span>: <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://www.amd.com/en/support/downloads/drivers.html/graphics/radeon-rx/radeon-rx-5000-series/amd-radeon-rx-5700.html#amd_support_product_spec">AMD Radeon RX 5700</a>      <span class="motd-gray">          made by <span class="motd-white">teq</span></span>',
	'<span class="motd-magenta"> RAM</span>: 32 GiB (76%)                      <a href="/bio" class="inline-a">more of me</a>',
	'<span class="motd-magenta"> Disk</span>: 558 GiB (81%) <a target="_blank" rel="noopener noreferrer" class="inline-a" href="https://btrfs.readthedocs.io/en/latest/">btrfs</a>',
	'<span class="motd-gray">└─────────────────────────────┘</span><span class="motd-gray">└─────────────────────────────┘</span>',
	'<span style="padding-left:2ch;"><span class="motd-red">●</span> <span class="motd-yellow">●</span> <span class="motd-green">●</span> <span class="motd-cyan">●</span> <span class="motd-blue">●</span> <span class="motd-magenta">●</span></span>',
];

onMounted(async () => {
	for (const line of motdLines) {
		displayedLines.value.push(line)
		await new Promise(resolve => setTimeout(resolve, 20))
	}
})
</script>

<style>
.motd-line {
	font-family: 'JetBrainsMono Nerd Font Mono', monospace;
}

.motd-gray {
	color: #888;
}

.motd-white {
	color: #fff;
}

.motd-red {
	color: #e06c75;
}

.motd-yellow {
	color: #e5c07b;
}

.motd-green {
	color: #98c379;
}

.motd-blue {
	color: #61afef;
}

.motd-magenta {
	color: #c678dd;
}

.motd-cyan {
	color: #56b6c2;
}
</style>
