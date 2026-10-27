const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Story = require('../models/Story');
const Bookmark = require('../models/Bookmark');

const seedDatabase = async () => {
  console.log('[Seed] Seeding database with initial users and world folklore archive...');

  const existingUsersCount = await User.countDocuments();
  let admin, curator;

  if (existingUsersCount === 0) {
    // Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('AtlasAdmin2026!', salt);
    const curatorPasswordHash = await bcrypt.hash('Curator2026!', salt);

    admin = await User.create({
      displayName: 'Archivist Ignatius',
      email: 'admin@mythosatlas.org',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatarUrl: '/images/artwork/cosmic_abyss.jpg',
      bio: 'Chief Chronicler of the Mythos Atlas. Overseer of esoteric records and historical anomalies.'
    });

    curator = await User.create({
      displayName: 'Rowena Ravenscroft',
      email: 'curator@mythosatlas.org',
      passwordHash: curatorPasswordHash,
      role: 'user',
      avatarUrl: '/images/artwork/kuchisake_spirit.jpg',
      bio: 'Folklore researcher specializing in cross-cultural spectral apparitions and cryptid topography.'
    });

    console.log('[Seed] Created users:');
    console.log('  Admin: admin@mythosatlas.org / AtlasAdmin2026!');
    console.log('  Curator: curator@mythosatlas.org / Curator2026!');
  } else {
    admin = await User.findOne({ email: 'admin@mythosatlas.org' });
    curator = await User.findOne({ email: 'curator@mythosatlas.org' }) || admin;
    console.log('[Seed] Verified existing administrative and curator accounts.');
  }


  // Flagship folklore stories
  const stories = [
    {
      title: 'The Wendigo',
      slug: 'the-wendigo',
      summary: 'A malevolent cannibalistic spirit or monstrous embodiment of insatiable hunger, desolation, and winter isolation from northern Algonquian traditions.',
      body: `### The Spirit of Starvation and Winter Cold

In the oral traditions of the Algonquian-speaking peoples—including the Ojibwe, Cree, Naskapi, and Innu—the **Wendigo** (also transcribed as *Windigo*, *Witiko*, or *Wendiko*) is far more than a monster of the wilderness: it is a profound moral, ecological, and psychological warning.

Rooted in the subarctic taiga and northern woodlands of North America, the legend warned human communities of the deadly psychological decay born from harsh, starving winters and the catastrophic taboo of cannibalism.

### Physical Manifestation and Transformation

Traditional descriptions describe the Wendigo not simply as an antlered deer-creature (a 20th-century Hollywood addition), but as an emaciated giant whose desiccated skin is pulled taut over protruding bones:
- **Ash-gray complexion:** The color of decaying flesh and graveyard earth.
- **Sunken, cavernous eyes:** Glowing with feral hunger from deep within its skull.
- **Tattered lips and missing fingers:** Gnawed away in its perpetual frenzy to consume anything, even its own body.
- **The Stench of Rot:** Accompanying an unnatural drop in temperature, freezing winds, and the rattling crack of pine branches in utter silence.

> "With every human victim the Wendigo consumes, its body grows in equal proportion to the meal, ensuring that its hunger is never satisfied, doomed to starve for eternity."

### Cultural and Ethical Significance

Anthropologists and First Nations scholars interpret the Wendigo as an allegory for unrestrained greed, selfishness, and the destruction of the communal bond. In traditional hunting communities where survival depended entirely on mutual sharing and conservation of game, taking more than one’s share or hoarding food was considered the beginning of the "Wendigo sickness."

In contemporary Indigenous literature, the Wendigo frequently symbolizes exploitative resource extraction, corporate greed, and the ongoing ravaging of sacred ancestral lands.`,
      category: 'cryptids',
      continent: 'North America',
      country: 'Canada',
      region: 'Ontario & Subarctic Boreal Forest',
      originCommunity: 'Algonquian Indigenous Peoples (Ojibwe, Cree, Innu)',
      historicalPeriod: 'Pre-Colonial Oral Antiquity',
      location: {
        type: 'Point',
        coordinates: [-84.5120, 48.2482] // Northern Ontario Boreal
      },
      locationIsApproximate: true,
      tags: ['wendigo', 'algonquian', 'boreal-forest', 'winter-curse', 'cryptid', 'cannibalism'],
      heroImage: {
        url: '/images/artwork/wendigo_forest.jpg',
        alt: 'Atmospheric dark forest with a skull moon glowing over silent mossy waters',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'wendigo-parallax',
      sources: [
        { title: 'Brightman, Robert A. "The Windigo in the Material World." Ethnohistory 35, no. 4 (1988)', url: 'https://www.jstor.org/stable/482169' },
        { title: 'Colombo, John Robert. "Windigo: An Anthology of Fact and Fantastic Fiction." (1982)', url: '' }
      ],
      status: 'published',
      featured: true,
      viewCount: 4280,
      createdBy: admin._id
    },
    {
      title: 'Kuchisake-onna (The Slit-Mouthed Woman)',
      slug: 'kuchisake-onna',
      summary: 'A terrifying modern Japanese urban legend of a mutilated woman wearing a surgical mask who accosts travelers with a deadly question.',
      body: `### The Legend of the Surgical Mask

Throughout Japanese urban folklore, few figures hold as much chilling cultural resonance as **Kuchisake-onna** (口裂け女, *"Slit-Mouthed Woman"*).

Emerging in modern form during the late 1970s in Gifu Prefecture and quickly spreading nationwide via schoolyard whispers, rumors of Kuchisake-onna caused genuine nationwide panic in 1979—leading schools to dismiss children in groups accompanied by teachers and police patrols.

### The Encounter

The legend typically unfolds on quiet, fog-shrouded streets at twilight:
1. A woman wearing a long trench coat and a surgical mask (a common sight in Japan for seasonal allergies) approaches a solitary pedestrian.
2. She steps forward and softly asks: *"Watashi, kirei?"* (*"Am I beautiful?"*).
3. If the victim answers **"No"**, she immediately slays them with a massive pair of rusty tailor's shears.
4. If the victim nervously answers **"Yes"**, she pulls down her mask to reveal her face: her mouth is carved ear-to-ear into a grotesque, jagged grin dripping with blood.
5. She repeats the question in a guttural whisper: *"Kore demo?"* (*"Even now?"*).
6. Answering "No" results in immediate decapitation; answering "Yes" results in her slicing the victim’s mouth ear-to-ear to mirror her own horrific countenance.

### Evading the Apparition

Folklore collectors noted several folkloric countermeasures invented by school children across Japan:
- **Confusing her with ambiguity:** Replying *"You look average"* or *"So-so"* (*"Mā-mā"*) confuses her just long enough for the victim to flee.
- **Offering Hard Candy:** Throwing traditional hard amber candies (*Bekko-ame*) or pomade causes her to pause and pick them up, giving the victim crucial seconds to escape.

### Historical Roots

While popularized in 1979, the tale traces its roots back to the Edo period (1603–1867), where stories told of samurai wives mutilated by jealous husbands, returning as vengeful *onryō* (vengeful spirits) seeking retribution across the centuries.`,
      category: 'urban-legends',
      continent: 'Asia',
      country: 'Japan',
      region: 'Gifu Prefecture & Tokyo',
      originCommunity: 'Contemporary Japanese Schoolyard & Edo Onryō Lore',
      historicalPeriod: 'Edo Period through 1979 Modern Urban Panic',
      location: {
        type: 'Point',
        coordinates: [136.7223, 35.4233] // Gifu, Japan
      },
      locationIsApproximate: false,
      tags: ['kuchisake-onna', 'japan', 'urban-legend', 'onryo', 'yokai', 'shears', 'folklore'],
      heroImage: {
        url: '/images/artwork/kuchisake_spirit.jpg',
        alt: 'Intricate woodcut-style portrait of a spectral maiden intertwined with bone and wing motifs',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'spectral-glow',
      sources: [
        { title: 'Foster, Michael Dylan. "The Book of Yokai: Mysterious Creatures of Japanese Folklore." University of California Press (2015)', url: 'https://www.ucpress.edu' },
        { title: 'Meyer, Matthew. "The Night Parade of One Hundred Demons." (2012)', url: 'http://yokai.com' }
      ],
      status: 'published',
      featured: true,
      viewCount: 3890,
      createdBy: admin._id
    },
    {
      title: 'The Headless Horseman of Sleepy Hollow',
      slug: 'the-headless-horseman-of-sleepy-hollow',
      summary: 'The relentless Hessian cavalryman decapitated by a cannonball who rides nightly through Sleepy Hollow in search of his severed head.',
      body: `### The Ghost of the Hessian Jäger

Perched along the mist-draped eastern bank of the Hudson River lies the secluded glen of **Sleepy Hollow**. According to local folklore chronicled by Washington Irving in 1820, the hollow is enchanted by a visionary propensity that infects the quiet air with ghostly daydreams and spectral apparitions.

Dominating all local ghost lore is the shadowy specter of the **Headless Horseman**: the restless spirit of a Hessian cavalryman who served during the American Revolutionary War.

### The Decapitating Cannonball

Historical records from the Battle of White Plains (October 1776) recount that a Hessian trooper had his head violently severed by a screaming six-pound American cannonball. His comrades hurriedly buried his headless remains in the churchyard of the Old Dutch Church of Sleepy Hollow.

Deprived of his head and resting in unhallowed soil, his spirit is said to mount his midnight charger every night, riding with supernatural speed toward the battleground in a frantic, eternal search for his head before the first cockcrow at dawn.

### The Old Dutch Burying Ground and the Covered Bridge

The epicenter of the legend centers upon the ancient stone bridge crossing the Pocantico River. Legend maintains that the demonic power of the ghost is constrained by running water; once a terrified traveler crosses the keystones of the bridge, the Horseman is hurled backward into a burst of fire and brimstone.`,
      category: 'ghost-stories',
      continent: 'North America',
      country: 'United States',
      region: 'Sleepy Hollow, New York',
      originCommunity: 'Hudson Valley Dutch-American Folklore',
      historicalPeriod: 'American Revolutionary War (1776)',
      location: {
        type: 'Point',
        coordinates: [-73.8584, 41.0857] // Sleepy Hollow, NY
      },
      locationIsApproximate: false,
      tags: ['headless-horseman', 'sleepy-hollow', 'new-york', 'hessian', 'ghost-story', 'revolutionary-war'],
      heroImage: {
        url: '/images/artwork/wendigo_forest.jpg',
        alt: 'Nocturnal woodland under an eerie skull moon representing the haunting of Sleepy Hollow',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'flickering-lantern',
      sources: [
        { title: 'Irving, Washington. "The Legend of Sleepy Hollow." The Sketch Book of Geoffrey Crayon, Gent. (1820)', url: '' },
        { title: 'Historical Society of the Tarrytowns Archive Records', url: 'https://historicsleepyhollow.org' }
      ],
      status: 'published',
      featured: true,
      viewCount: 3120,
      createdBy: admin._id
    },
    {
      title: 'The Cursed Ruins of Bhangarh Fort',
      slug: 'bhangarh-fort-curse',
      summary: 'A 16th-century royal citadel in Rajasthan enveloped in dark sorcery, an eternal tantric curse, and legal bans against entering after sundown.',
      body: `### The Fort Where Sundown Forbids Entry

Nestled at the foot of the rugged Aravalli Range in the Alwar district of Rajasthan, India, **Bhangarh Fort** (भानगढ़ दुर्ग) stands as one of the world\'s most infamous haunted archaeological complexes.

The site is so intensely regarded as paranormal that the **Archaeological Survey of India (ASI)** has erected a legally binding signboard strictly prohibiting entry to all humans between sunset and sunrise.

### The Curse of Guru Balu Nath and the Tantric Sorcerer

Two competing legendary curses explain the sudden desolation of this once-prosperous 16th-century royal capital:

1. **The Shadow of Guru Balu Nath:** Emperor Madho Singh built the fort only after ascetic Guru Balu Nath granted permission on one strict condition: *"The moment the shadow of your palaces touches my meditation hermitage, the entire city shall crumble into ash."* Generations later, an ambitious successor added vertical towers whose long shadow fell across the hermit’s sanctuary, unleashing immediate catastrophe.
2. **The Curse of Tantric Wizard Singhia:** Another beloved legend recalls Singhia, a black-magic sorcerer who fell madly in love with the virtuous Princess Ratnavati of Bhangarh. He enchanted a vial of scented oil to compel her affection; Ratnavati saw through the deception and smashed the bottle against a colossal boulder. The magically attracted boulder rolled forward and crushed the sorcerer to death—but with his dying breath, Singhia cursed the fort, its royal bloodline, and every resident to perish without reincarnation, their souls trapped within the stone forever.

Within months, a brutal invasion by neighboring forces massacred the inhabitants, leaving the stone halls desolate, open to the desert winds and restless spirits.`,
      category: 'haunted-places',
      continent: 'Asia',
      country: 'India',
      region: 'Alwar District, Rajasthan',
      originCommunity: 'Rajasthani Royal Chronicles and Local Rajput Traditions',
      historicalPeriod: '1573 CE (Mughal & Rajput Era)',
      location: {
        type: 'Point',
        coordinates: [76.2867, 27.0964] // Bhangarh Fort, Rajasthan
      },
      locationIsApproximate: false,
      tags: ['bhangarh-fort', 'india', 'rajasthan', 'curse', 'haunted-place', 'tantra', 'asi'],
      heroImage: {
        url: '/images/artwork/cavern_crypt.jpg',
        alt: 'Subterranean stone ossuary and forgotten crypt ruins draped in moss and ancient bone',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'flickering-lantern',
      sources: [
        { title: 'Archaeological Survey of India Monument Registry: Bhangarh Ruins', url: 'https://asi.nic.in' },
        { title: 'Tod, James. "Annals and Antiquities of Rajasthan." (1829)', url: '' }
      ],
      status: 'published',
      featured: true,
      viewCount: 4560,
      createdBy: admin._id
    },
    {
      title: 'The Loch Ness Monster (Nessie)',
      slug: 'loch-ness-monster',
      summary: 'The mysterious, ancient serpentine aquatic beast dwelling within the cold, peat-black depths of Scotland\'s deepest freshwater loch.',
      body: `### The Abyssal Enigma of the Scottish Highlands

Stretching across 23 miles of the Great Glen Fault in the Scottish Highlands, **Loch Ness** holds more freshwater than all the lakes in England and Wales combined. Its waters are perpetually frigid, murky with black peat runoff, and reach abyssal depths of up to 755 feet.

Within this subterranean gloom dwells **Nessie**, the world’s most famous cryptid.

### From Saint Columba to Modern Sonar Anomaly

While 1933 marked the modern explosion of sightings following the opening of the A82 lakeside road, the legend dates back to antiquity:
- **Adomnán\'s Life of St. Columba (565 CE):** The earliest written account documents Irish monk Saint Columba rescuing a Pictish swimmer from a ferocious "water monster" (*aquatilis bestia*) on the River Ness by invoking the sign of the cross and commanding: *"Go no further! Touch not the man! Go back with all speed!"*
- **The "Surgeon\'s Photograph" (1934):** The iconic silhouette of a long, graceful neck emerging from ripples captivated the global imagination for generations, later confessed to be a toy submarine rigged with wood putty—yet authentic sonar blips and unexplainable deep-water biomass readings continue to intrigue oceanographers.

### Scientific Theories: Plesiosaur Relic or Giant Eel?

Speculation ranges from surviving plesiosaur populations adapted to subglacial freshwater to giant mutated Anguilla eels, as suggested by extensive 2018 environmental DNA (eDNA) biodiversity surveys conducted by the University of Otago.`,
      category: 'cryptids',
      continent: 'Europe',
      country: 'United Kingdom',
      region: 'Scottish Highlands',
      originCommunity: 'Celtic, Pictish, and Scottish Highland Lore',
      historicalPeriod: '6th Century CE to Present',
      location: {
        type: 'Point',
        coordinates: [-4.4244, 57.3229] // Loch Ness, Scotland
      },
      locationIsApproximate: false,
      tags: ['nessie', 'loch-ness', 'scotland', 'cryptid', 'highlands', 'plesiosaur', 'lake-monster'],
      heroImage: {
        url: '/images/artwork/cosmic_abyss.jpg',
        alt: 'Grand cosmic vortex over an abyssal gothic castle and churning deep dark waters',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'abyssal-vortex',
      sources: [
        { title: 'Adomnán of Iona. "Vita Columbae" (Life of Saint Columba), circa 700 CE', url: '' },
        { title: 'Gemmell, Neil et al. "Environmental DNA survey of Loch Ness." University of Otago (2019)', url: 'https://www.otago.ac.nz' }
      ],
      status: 'published',
      featured: true,
      viewCount: 5210,
      createdBy: admin._id
    },
    {
      title: 'The Bermuda Triangle (Devil\'s Triangle)',
      slug: 'the-bermuda-triangle',
      summary: 'A notorious maritime expanse bounded by Miami, Bermuda, and Puerto Rico where ships and aircraft have vanished into thin air.',
      body: `### The Graveyard of the Atlantic

Spanning roughly 500,000 square miles between the Straits of Florida, the island of Bermuda, and San Juan, Puerto Rico, the **Bermuda Triangle** has earned a legendary reputation for inexplicable compass anomalies, erratic electromagnetic phenomena, and vanishing vessels.

### Flight 19: The Lost Patrol of 1945

The definitive incident occurred on December 5, 1945. Five TBM Avenger torpedo bombers carrying 14 experienced airmen departed Fort Lauderdale on routine navigational exercise Flight 19.

Hours into flight, flight leader Lt. Charles Taylor radioed the control tower:
> *"Both my compasses are out and I am trying to find Fort Lauderdale... We can't be sure of any direction. Everything is wrong... strange. Even the ocean doesn't look as it should."*

No wreckage, life rafts, or oil slicks were ever located. A PBM Mariner rescue plane dispatched with a 13-man crew to search for Flight 19 also vanished without a single distress signal.

### The Hypotheses: Rogue Waves to Magnetic Deviations

Scientists attribute the phenomenon to:
1. **Methane Hydrate Eruptions:** Massive undersea gas releases drastically reducing water density, causing ships to sink instantly.
2. **Rogue Waves:** Colossal rogue waves up to 100 feet tall formed by collision of Gulf Stream currents and Atlantic storm cells.
3. **True vs. Magnetic North:** One of the rare places on Earth where magnetic compasses point directly to true geographic north without declination correction.`,
      category: 'unexplained-phenomena',
      continent: 'North America',
      country: 'United States',
      region: 'North Atlantic Ocean',
      originCommunity: 'Modern Maritime & Aviation Lore',
      historicalPeriod: 'Mid-20th Century to Present',
      location: {
        type: 'Point',
        coordinates: [-64.7574, 25.0000] // Centroid of Bermuda Triangle
      },
      locationIsApproximate: true,
      tags: ['bermuda-triangle', 'unexplained-phenomena', 'flight-19', 'atlantic', 'disappearances', 'rogue-waves'],
      heroImage: {
        url: '/images/artwork/cosmic_abyss.jpg',
        alt: 'Swirling celestial vortex over tempestuous dark ocean',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'abyssal-vortex',
      sources: [
        { title: 'Kusche, Lawrence David. "The Bermuda Triangle Mystery—Solved." (1975)', url: '' },
        { title: 'Naval History and Heritage Command: The Loss of Flight 19', url: 'https://www.history.navy.mil' }
      ],
      status: 'published',
      featured: false,
      viewCount: 2980,
      createdBy: admin._id
    },
    {
      title: 'La Llorona (The Weeping Woman)',
      slug: 'la-llorona-the-weeping-woman',
      summary: 'The tragic and horrifying spirit of a weeping mother doomed to roam riverbanks and misty canals, crying out for her drowned children.',
      body: `### The Wailing along the Canals

*"¡Ay, mis hijos!"* (*"Oh, my children!"*)

Across Mexico, Central America, and the American Southwest, the harrowing cry of **La Llorona** is known to send shivers through generations of families. She is the ghost of a mother doomed to wander near rivers, canals, and arroyos for all eternity, searching for the children she drowned in a fit of grief and madness.

### The Legend of Maria

In the most prevalent colonial telling, a woman named Maria fell in love with a wealthy Spanish nobleman. After bearing him two sons, the nobleman abandoned her to marry an aristocrat of his own social standing.

Driven insane by jealousy, betrayal, and blinding sorrow, Maria took her sons to the riverbank and held them underwater until they ceased struggling. Only when their lifeless bodies floated downriver did the weight of what she had done shatter her mind. Weeping hysterically, she threw herself into the rushing waters.

Denied entry into the afterlife until she can bring the souls of her children before heaven, she stalks the waterways at midnight, stealing away wandering children in the dark mist.

### Aztec Precursors: Cihuacoatl

Scholars trace the origin of La Llorona far prior to Spanish colonization, connecting her directly to the Aztec goddess **Cihuacoatl** ("Snake Woman"). Prior to the arrival of Hernán Cortés, Aztec chronicles recorded terrifying omens in Tenochtitlan: a weeping woman in white walking the canals at night, crying: *"My beloved children, your destruction has arrived! Where shall I take you?"*`,
      category: 'ghost-stories',
      continent: 'North America',
      country: 'Mexico',
      region: 'Xochimilco, Mexico City',
      originCommunity: 'Mesoamerican (Nahua) and Hispanic Mexican Folklore',
      historicalPeriod: 'Pre-Columbian to Colonial Era',
      location: {
        type: 'Point',
        coordinates: [-99.1026, 19.2633] // Xochimilco canals, Mexico
      },
      locationIsApproximate: false,
      tags: ['la-llorona', 'mexico', 'xochimilco', 'ghost-story', 'cihuacoatl', 'weeping-woman'],
      heroImage: {
        url: '/images/artwork/kuchisake_spirit.jpg',
        alt: 'Spectral female apparition emerging from dark mist and weeping',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'spectral-glow',
      sources: [
        { title: 'Sahagún, Bernardino de. "Florentine Codex: General History of the Things of New Spain" (1577)', url: '' },
        { title: 'Perez, Domino Renee. "There Was a Woman: La Llorona from Folklore to Popular Culture." (2008)', url: 'https://www.utexaspress.com' }
      ],
      status: 'published',
      featured: false,
      viewCount: 3670,
      createdBy: admin._id
    },
    {
      title: 'The Catacombs of Paris: The Empire of the Dead',
      slug: 'paris-catacombs-empire-of-the-dead',
      summary: 'A labyrinthine ossuary sprawling beneath the streets of Paris, holding the organized skeletal remains of more than six million human souls.',
      body: `### Arrête! C'est ici l'empire de la Mort

*"Halt! This is the Empire of Death."*

Carved above the entrance to the **Paris Catacombs**, this carved stone inscription welcomes visitors into a 200-mile labyrinth of subterranean limestone quarries converted into a municipal ossuary in the late 18th century.

Faced with overflowing city cemeteries like *Les Innocents*—where putrefying mass graves began collapsing into surrounding basements—the Parisian government spent decades exhuming six million bodies under cover of darkness, stacking skulls and femurs into neat, architectural walls.

### Spectral Legends and the Lost Phibert Aspairt

The catacombs have inspired countless supernatural accounts:
- **Philibert Aspairt (1793):** The hospital doorkeeper entered the quarry labyrinth searching for the Val-de-Grâce monastery cellar and was never seen alive again. His skeleton was found eleven years later, identifiable only by his brass key ring.
- **The Cataphiles and Whispering Tunnels:** Unauthorized subterranean explorers ("cataphiles") describe unmapped corridors where shadows detach from walls, flashlights inexplicably drain in seconds, and disembodied voices whisper from deep inside the bone walls.`,
      category: 'haunted-places',
      continent: 'Europe',
      country: 'France',
      region: 'Paris (14th Arrondissement)',
      originCommunity: 'French Historical & Subterranean Lore',
      historicalPeriod: '1786–1814 CE',
      location: {
        type: 'Point',
        coordinates: [2.3324, 48.8338] // Paris Catacombs entrance
      },
      locationIsApproximate: false,
      tags: ['catacombs', 'paris', 'france', 'ossuary', 'haunted-places', 'skulls', 'labyrinth'],
      heroImage: {
        url: '/images/artwork/cavern_crypt.jpg',
        alt: 'Subterranean crypt covered in thousands of ancient skulls and bones',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'flickering-lantern',
      sources: [
        { title: 'Official Paris Catacombs Historical Guide & Municipal Records', url: 'https://www.catacombes.paris.fr' }
      ],
      status: 'published',
      featured: false,
      viewCount: 3410,
      createdBy: admin._id
    },
    {
      title: 'The Golem of Prague',
      slug: 'the-golem-of-prague',
      summary: 'The colossal anthropomorphic guardian brought to life from Vltava River clay through Hebrew incantations by Rabbi Judah Loew.',
      body: `### The Clay Defender of the Jewish Quarter

During the late 16th century, under the reign of Holy Roman Emperor Rudolf II, the Jewish community of Prague lived under constant threat of anti-Semitic pogroms and accusations.

According to legendary Jewish folklore, the revered mystic and scholar **Rabbi Judah Loew ben Bezalel** (the Maharal of Prague) turned to the esoteric teachings of the *Sefer Yetzirah* (Book of Creation) to fashion a protector.

### The Ritual of Creation

Accompanying two disciples representing fire and water to the muddy banks of the Vltava River, Rabbi Loew molded a giant human figure out of yellow river clay.

Circling the effigy while reciting sacred Hebrew letter combinations, the cold clay began to warm and glow. Finally, Rabbi Loew inscribed the Hebrew word **EMET** (אמת, meaning *"Truth"*) upon the creature's forehead and inserted a parchment inscribed with the Tetragrammaton beneath its tongue.

The clay figure opened its dark eyes and rose: the **Golem** was born.

### The Madness and Attic of the Old-New Synagogue

The Golem served faithfully, but possessed no human soul or speech. Eventually, during a Sabbath eve, Rabbi Loew forgot to remove the parchment, and the Golem went berserk, rampaging through the streets.

Heartbroken, the Rabbi erased the first letter 'Aleph' from the creature's forehead, leaving the word **MET** (מת, meaning *"Dead"*). The giant collapsed back into inert river mud.

Legend holds that the remains of the Golem remain sealed to this day in the locked, stairless attic (*genizah*) of Prague's **Old-New Synagogue**, awaiting the day it must rise again.`,
      category: 'myths-legends',
      continent: 'Europe',
      country: 'Czech Republic',
      region: 'Josefov (Jewish Quarter), Prague',
      originCommunity: 'Prague Jewish Kabbalistic Folklore',
      historicalPeriod: '16th Century CE (1580)',
      location: {
        type: 'Point',
        coordinates: [14.4184, 50.0903] // Old-New Synagogue, Prague
      },
      locationIsApproximate: false,
      tags: ['golem', 'prague', 'czech-republic', 'jewish-folklore', 'kabbalah', 'clay-guardian'],
      heroImage: {
        url: '/images/artwork/botanical_scroll.png',
        alt: 'Antiquarian scroll illustration depicting mystical organic symbols',
        credit: 'Mythos Atlas Archival Reference Collection',
        license: 'Curatorial Archive Reference'
      },
      visualEffect: 'spectral-glow',
      sources: [
        { title: 'Rosenfeld, Beate. "Die Golemsage und ihre Verwertung in der deutschen Literatur." (1934)', url: '' },
        { title: 'Idel, Moshe. "Golem: Jewish Magical and Mystical Traditions on the Artificial Anthropoid." (1990)', url: 'https://sunypress.edu' }
      ],
      status: 'published',
      featured: false,
      viewCount: 2790,
      createdBy: admin._id
    },
    // Community Submissions in 'pending' status for the moderation queue
    {
      title: 'The Black Dog of Newgate Prison',
      slug: 'the-black-dog-of-newgate',
      summary: 'A monstrous spectral hound spawned by a famished medieval prisoner that haunted the grim corridors of London\'s most infamous jail.',
      body: `During the great famine of 1241 in the reign of King Henry III, prisoners in Newgate Gaol starved in darkness. When a wealthy scholar was imprisoned on charges of sorcery, the starving inmates murdered and devoured him. Soon after, a ferocious black dog walked the cellblocks, devouring the guilty men one by one. Centuries later, guards and inmates reported hearing clanking chains and seeing burning spectral eyes in the stone passageways.`,
      category: 'ghost-stories',
      continent: 'Europe',
      country: 'United Kingdom',
      region: 'London',
      originCommunity: 'Medieval English Folklore',
      historicalPeriod: '13th Century (1241 CE)',
      location: {
        type: 'Point',
        coordinates: [-0.1009, 51.5158] // Old Newgate site
      },
      locationIsApproximate: false,
      tags: ['black-dog', 'newgate', 'london', 'ghost-story', 'medieval'],
      heroImage: {
        url: '/images/artwork/wendigo_forest.jpg',
        alt: 'Dark spectral woods with lurking predator',
        credit: 'Curator Community Submission',
        license: 'Community Submission'
      },
      sources: [
        { title: 'Luke Hutton. "The Discovery of a London Monster Called The Black Dog of Newgate" (1596)', url: '' }
      ],
      status: 'pending', // Pending moderation review
      featured: false,
      viewCount: 0,
      createdBy: curator._id
    },
    {
      title: 'The Vanishing Hitchhiker of Resurrection Cemetery',
      slug: 'resurrection-mary-chicago',
      summary: 'Resurrection Mary: Chicago\'s most renowned phantom hitchhiker seen dancing in ballrooms and vanishing outside the cemetery gates.',
      body: `Since the 1930s along Archer Avenue in Justice, Illinois, motorists have reported picking up a quiet young blonde woman in a white dance gown and thin evening shawl. She asks for a ride home toward Resurrection Cemetery, and as the car passes the main iron gates, she vanishes into thin air or leaves behind scorched handprints on the iron cemetery bars.`,
      category: 'urban-legends',
      continent: 'North America',
      country: 'United States',
      region: 'Justice, Illinois (Chicago)',
      originCommunity: 'Midwestern American Urban Legend',
      historicalPeriod: '1930s Great Depression Era to Present',
      location: {
        type: 'Point',
        coordinates: [-87.8347, 41.7483] // Resurrection Cemetery, Illinois
      },
      locationIsApproximate: false,
      tags: ['resurrection-mary', 'chicago', 'urban-legend', 'vanishing-hitchhiker', 'phantom'],
      heroImage: {
        url: '/images/artwork/kuchisake_spirit.jpg',
        alt: 'Spectral maiden in white evening veil',
        credit: 'Curator Community Submission',
        license: 'Community Submission'
      },
      sources: [
        { title: 'Bielski, Ursula. "Chicago Haunts: Ghostlore of the Windy City." (1998)', url: '' }
      ],
      status: 'pending', // Pending moderation review
      featured: false,
      viewCount: 0,
      createdBy: curator._id
    }
  ];

  const existingStoriesCount = await Story.countDocuments();
  if (existingStoriesCount === 0) {
    const createdStories = await Story.insertMany(stories);
    console.log(`[Seed] Seeded ${createdStories.length} stories.`);

    // Create initial bookmark for curator on The Wendigo
    const wendigo = createdStories.find(s => s.slug === 'the-wendigo');
    if (wendigo && curator) {
      await Bookmark.create({
        userId: curator._id,
        storyId: wendigo._id
      });
      console.log('[Seed] Created sample bookmark for curator on The Wendigo.');
    }
  } else {
    console.log(`[Seed] Database already contains ${existingStoriesCount} stories. Skipping initial seed insert to preserve records.`);
  }

  console.log('[Seed] Database initialization complete!');
};


module.exports = { seedDatabase };
