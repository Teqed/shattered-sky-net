<script setup lang="ts">
const blurbs = [
	"Astronomically accurate!",
	"Cubism!",
	"Mostly harmless!",
	"!!!1!",
	"Dramatic lighting!",
	"Multithreaded!",
	"Hmmmrmm.",
	"Episode 3!",
	"As seen on TV!",
	"Awesome!",
	"100% pure!",
	"May contain nuts!",
	"Less polygons!",
	"Limited edition!",
	"It's here!",
	"Best in class!",
	"Excitement!",
	"One of a kind!",
	"Spiders everywhere!",
	"Check it out!",
	"Holy cow, man!",
	"Reticulating splines!",
	"Yaaay!",
	"That's no moon!",
	"l33t!",
	"Exclusive!",
	"The bee's knees!",
	"Classy!",
	"Wow!",
	"Oh man!",
	"Pixels!",
	"Enhanced!",
	"90% bug free!",
	"Pretty!",
	"12 herbs and spices!",
	"Fat free!",
	"Free dental!",
	"Ask your doctor!",
	"Cloud computing!",
	"Hard to label!",
	"Technically good!",
	"Bringing home the bacon!",
	"Euclidian!",
	"Now in 3D!",
	"Inspirational!",
	"Complex cellular automata!",
	"Thousands of colors!",
	"Try it!",
	"Sensational!",
	"Play him off, keyboard cat!",
	"Guaranteed!",
	"Macroscopic!",
	"Bring it on!",
	"Random splash!",
	"Call your mother!",
	"Monster infighting!",
	"Loved by millions!",
	"Ultimate edition!",
	"Freaky!",
	"You've got a brand new key!",
	"Water proof!",
	"Uninflammable!",
	"Whoa, dude!",
	"All inclusive!",
	"Tell your friends!",
	"NP is not in P!",
	"Haunted!",
	"Polynomial!",
	"Terrestrial!",
	"All is full of love!",
	"Full of stars!",
	"Scientific!",
	"Collaborate and listen!",
	"Take frequent breaks!",
	"Not linear!",
	"Han shot first!",
	"Nice to meet you!",
	"Buckets of lava!",
	"sqrt(-1) love you!",
	"0% sugar!",
	"150% hyperbole!",
	"20 GOTO 10!",
	"Cogito ergo sum!",
	"A skeleton popped out!",
	"The sum of its parts!",
	"Finger-licking!",
	"Thematic!",
	"Pneumatic!",
	"Sublime!",
	"Octagonal!",
	"Une baguette!",
	"Supercalifragilisticexpialidocious!",
	"Double buffered!",
	"V-synched!",
	"Hotter than the sun!",
	"Internet enabled!",
	"Autonomous!",
	"Engage!",
	"Fantasy!",
	"Tip your waiter!",
	"Very fun!",
	"12345 is a bad password!",
	"Vote for net neutrality!",
	"Lives in a pineapple under the sea!",
	"Omnipotent!",
	"Gasp!",
	"...!",
	"Bees, bees, bees, bees!",
	"So fresh, so clean!",
	"Don't look directly at the bugs!",
	"Scary!",
	"Jump up, jump up, and get down!",
	"A riddle, wrapped in a mystery!",
	"Stay a while, stay forever!",
	"Stay a while and listen!",
	"Treatment for your rash!",
	"Information wants to be free!",
	"\"Almost never\" is an interesting concept!",
	"Lots of truthiness!",
	"It's groundbreaking!",
	"Let our battles begin!",
	"The sky is the limit!",
	"Undefeated!",
	"Leveraging synergy!",
	"That's super!",
	"Read more books!",
	"Khaaaaaaaaan!",
	"Less addictive than TV Tropes!",
	"More addictive than lemonade!",
	"Bigger than a bread box!",
	"Millions of peaches!",
	"This is my true form!",
	"Don't bother with the clones!",
	"Endless!",
	"Feature packed!",
	"Boots with the fur!",
	"Stop, hammertime!",
	"Conventional!",
	"Homeomorphic to a 3-sphere!",
	"Doesn't avoid double negatives!",
	"Does barrel rolls!",
	"Meeting expectations!",
	"Got your nose!",
	"Technologic!",
	"Funk soul brother!",
	"I see your vocabulary has improved!",
	"Who put it there?",
	"You can't explain that!",
	"if not ok then return end",
	"Big Pointy Teeth!",
	"Mmmph, mmph!",
	"Don't feed avocados to parrots!",
	"Swords for everyone!",
	"Take her pillow!",
	"Put that cookie down!",
	"Pretty scary!",
	"I have a suggestion.",
	"Now with extra hugs!",
	"Woah.",
	"What's up, Doc?",
	"& Knuckles!",
	"Pandamonium!",
	"Machine learning!",
	"Living, breathing world!",
	"Innovating innovation!",
	"Change my mind.",
	"High-key!",
	"Throw yourself at the ground and miss",
	"Truly gone fishing!",
	"Yay, puppies for everyone!",
	"You're going too fast!",
	"Thanks for the fish!",
	"Have you finished your homework?",
	"We're working on it!",
	"A circle-free environment!",
	"When it's ready!",
	"Artisinal!",
	"The Floor is Lava!",
	"Protec but also attac",
	"Bananas!",
	"Oh geez!",
	"Crush it!",
	"Sodium free!",
	"What DOES the fox say?",
	"It came from space.",
	"Rainbow turtle?",
	"Something funny!",
	"I need more context.",
	"Ahhhhhh!",
	"Don't worry, be happy!",
	"Water bottle!",
	"What's the question?",
	"Plant a tree!",
	"Go to the dentist!",
	"What do you expect?",
	"Honey, I grew the bees!",
	"Find your claw!",
	"Bushy eyebrows!",
	"From free range developers!",
	"This parrot is no more! It has ceased to be!",
	"Aww man!",
	"And my pickaxe!",
	"Fabulous graphics!",
	"Vanilla!",
	"May contain traces of citrus!",
	"Contains simulated goats!",
	"Home-made!",
	"The cutest predator you'll ever meet!",
	"Get to the coppah!",
	"Board game version also available!",
	"Plant-based light sources!",
	"Who let the frogs out?",
	"RIBBIT!",
	"Nooooooooooooo!",
	"You are valid!",
	"I'm glad you're here!",
	"You are welcome here!",
]
// --- Lifecycle ---
onMounted(() => {
	function randomBlurb() {
		const blurbElement = document.querySelector('.greetings h2');
		if (blurbElement) {
			const currentMessage = blurbElement.textContent || "";
			const messageLength = currentMessage.length;
			let index = 0;
			const interval = setInterval(() => {
				if (index < messageLength - 1) {
					blurbElement.textContent = currentMessage.slice(0, messageLength - index - 1);
					index++;
				} else {
					clearInterval(interval);
					let newIndex = 0;
					const randomIndex = Math.floor(Math.random() * blurbs.length);
					const newMessage = blurbs[randomIndex] ? blurbs[randomIndex] : "Oh no...";
					const newInterval = setInterval(() => {
						if (newIndex < newMessage.length) {
							blurbElement.textContent = newMessage.slice(0, newIndex + 1);
							newIndex++;
						} else {
							clearInterval(newInterval);
						}
					}, 50); // Adjust the speed of the typing effect
				}
			}, 50); // Adjust the speed of the backspace effect
		}
	}
	const blurbInterval = setInterval(randomBlurb, 15000);
	return () => {
		clearInterval(blurbInterval);
	};
});
</script>

<template>
	<div class="greetings">
		<RouterLink to="/" class="greetings-container">
			<h1 class="blue">
				Shattered Sky
			</h1>
			<h1 class="blue, blur">
				Shattered Sky
			</h1>
		</RouterLink>
		<h2 class="blurb">{{ $t('title.sub') }}</h2>
	</div>
</template>

<style scoped>
.greetings-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	text-decoration: none;
	background-color: transparent;
}

.greetings h1 {
	font-size: min(8vw, 2.2rem);
	top: 0px;
	animation: slidein-top 0.28s ease-out;

	/* Change colors as a gradient */
	background: linear-gradient(300deg,
			rgb(132 0 255),
			rgb(174 0 255 / 50%) 20%),
		linear-gradient(100deg, rgb(0 242 255 / 90%), rgb(0 136 255 / 50%) 90%);
	background-blend-mode: color-dodge, color-dodge;
	font-weight: 600;
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.blur {
	opacity: 0;
	filter: blur(0);
	position: absolute;
	transition: opacity 0.28s ease, filter 0.28s ease;
}

.blur:hover {
	opacity: 0.8;
	filter: blur(5px);
}

.greetings h2 {
	text-align: center;
	font-size: min(2vw, 0.8rem);
	animation: slidein-top 0.28s ease-out;
	font-weight: 500;
	margin-bottom: 0.5vh;
	color: var(--color-heading);
}

@media (min-width: 1200px) {
	/* .greetings h1,
	.greetings h2 {
	text-align: left;
	} */
}
</style>
