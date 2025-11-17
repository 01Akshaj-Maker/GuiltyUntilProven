export type CrimeType = 'murder' | 'sabotage' | 'theft' | 'smuggling' | 'espionage' | 'poisoning' | 'arson';

export interface Location {
  name: string;
  description: string;
  accessLevel: 'public' | 'restricted' | 'secure';
  relevantRoles: string[];
}

export interface Evidence {
  id: string;
  description: string;
  linkedTo: string | null;
  discoveryQuestion?: string;
  keywords?: string[];
  unlockedBy?: string;
}

export interface CrimeScenario {
  crimeType: CrimeType;
  location: Location;
  timeOfCrime: string;
  victim?: string;
  stolenItem?: string;
  description: string;
  initialClues: string[];
  detailedEvidence: string[];
  hiddenEvidence: Evidence[];
  motive: string;
}

const LOCATIONS: Location[] = [
  {
    name: 'Med Bay',
    description: 'Medical facility with treatment rooms and pharmaceutical storage',
    accessLevel: 'restricted',
    relevantRoles: ['Doctor', 'Medic', 'Chief Medical Officer']
  },
  {
    name: 'Engineering',
    description: 'Power systems, reactor controls, and maintenance equipment',
    accessLevel: 'restricted',
    relevantRoles: ['Engineer', 'Chief Engineer', 'Technician']
  },
  {
    name: 'Cargo Hold',
    description: 'Storage area for supplies, equipment, and incoming shipments',
    accessLevel: 'public',
    relevantRoles: ['Cargo Specialist', 'Logistics Officer', 'Security']
  },
  {
    name: 'Command Center',
    description: 'Bridge with navigation controls and communication systems',
    accessLevel: 'secure',
    relevantRoles: ['Captain', 'Commander', 'Navigator', 'Communications Officer']
  },
  {
    name: 'Life Support',
    description: 'Oxygen generation, water recycling, and atmospheric controls',
    accessLevel: 'secure',
    relevantRoles: ['Engineer', 'Environmental Specialist', 'Technician']
  },
  {
    name: 'Armory',
    description: 'Weapons storage and security equipment locker',
    accessLevel: 'secure',
    relevantRoles: ['Security Chief', 'Security Officer', 'Commander']
  },
  {
    name: 'Research Lab',
    description: 'Scientific equipment and experimental specimens',
    accessLevel: 'restricted',
    relevantRoles: ['Scientist', 'Research Director', 'Lab Technician']
  },
  {
    name: 'Server Room',
    description: 'Data systems, mainframe computers, and network infrastructure',
    accessLevel: 'secure',
    relevantRoles: ['IT Specialist', 'Systems Administrator', 'Security Chief']
  },
  {
    name: 'Cafeteria',
    description: 'Dining area with food preparation and storage facilities',
    accessLevel: 'public',
    relevantRoles: ['Chef', 'Cook', 'Supply Officer']
  },
  {
    name: 'Quarters',
    description: 'Living spaces and personal crew accommodations',
    accessLevel: 'restricted',
    relevantRoles: ['All crew members']
  }
];

const VICTIMS = [
  'Lieutenant Sarah Martinez',
  'Chief Engineer David Kim',
  'Dr. Rebecca Foster',
  'Security Officer Marcus Chen',
  'Pilot Jackson Reed',
  'Technician Anna Volkov'
];

function getTimeMinusMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins - minutes;
  const newHours = Math.floor((totalMinutes + 1440) / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(Math.abs(newMinutes)).padStart(2, '0')}`;
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const CRIME_TEMPLATES: Record<CrimeType, {
  descriptionTemplate: (location: string, time: string, detail: string) => string;
  possibleDetails: string[];
  evidenceGenerator: (location: string, time: string, detail: string) => string[];
  evidenceTypes: string[];
  hiddenEvidenceGenerator: () => Array<{description: string; keywords: string[]; unlockedBy?: string}>;
  motives: string[];
}> = {
  murder: {
    descriptionTemplate: (location, time, detail) =>
      `A crew member has been found dead in the ${location} at ${time}. ${detail} The entire station is on lockdown until the killer is identified.`,
    possibleDetails: [
      'Cause of death appears to be blunt force trauma to the skull.',
      'The victim was strangled with a power cable - marks visible on neck.',
      'Multiple stab wounds found on the torso.',
      'The body shows extensive evidence of a violent struggle.',
      'Fatal blow to the head with a heavy maintenance tool.'
    ],
    evidenceGenerator: (location, time, detail) => {
      const timeMinusFive = getTimeMinusMinutes(time, 5);
      const causes = [
        `VICTIM: The deceased has been identified as Lieutenant Sarah Martinez. Body discovered by crew at ${time}.`,
        `CAUSE OF DEATH: Medical scan indicates ${detail.toLowerCase().includes('stab') ? 'multiple penetrating wounds' : detail.toLowerCase().includes('strangled') ? 'asphyxiation via ligature strangulation' : 'severe cranial trauma'}. Death occurred approximately ${timeMinusFive} (5 minutes before discovery).`,
        `PHYSICAL EVIDENCE: ${randomElement([
          `Blood spatter pattern suggests attack came from behind. Defensive wounds on victim's forearms indicate they tried to fight back.`,
          `Bloody fingerprints found on the ${location} door panel - partial match in forensics database.`,
          `Torn fabric from a standard crew uniform caught in victim's hand. Fibers are dark blue with red threading.`,
          `Muddy boot prints (size 10) leading away from the scene toward the maintenance corridor.`
        ])}`,
        `SCENE ANALYSIS: ${randomElement([
          `Victim's personal datapad was accessed 2 minutes before death - someone searched their files.`,
          `Security access log shows victim entered ${location} at ${getTimeMinusMinutes(time, 12)}. One other crew member accessed the area shortly after.`,
          `Surveillance cameras in ${location} were disabled at ${getTimeMinusMinutes(time, 8)} - 8 minutes before the murder.`,
          `Victim's keycard found 3 meters from body, suggesting it was removed by the killer.`
        ])}`
      ];
      return causes;
    },
    evidenceTypes: [
      'bloody fingerprints on the door panel',
      'strands of hair found at the scene',
      'a torn piece of uniform fabric',
      'muddy footprints leading away from the scene',
      'a missing access keycard found nearby'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Bloody fingerprints found on door panel - forensics analyzing for DNA match',
        keywords: ['blood', 'bloody', 'fingerprint', 'fingerprints', 'print', 'prints', 'touch', 'touched', 'door', 'panel', 'DNA', 'hands', 'hand'],
        unlockedBy: 'Security'
      },
      {
        description: 'Torn fabric from crew uniform caught in victim\'s hand - dark blue with red threading',
        keywords: ['fabric', 'cloth', 'torn', 'ripped', 'clothes', 'clothing', 'uniform', 'struggle', 'fought', 'fight', 'blue', 'thread'],
        unlockedBy: 'Any'
      },
      {
        description: 'Strands of hair and skin cells recovered from scene - DNA analysis in progress',
        keywords: ['hair', 'DNA', 'strand', 'strands', 'sample', 'samples', 'genetic', 'forensic', 'evidence', 'biological'],
        unlockedBy: 'Medical'
      },
      {
        description: 'Muddy boot prints (size 10) leading away from scene toward maintenance corridor',
        keywords: ['boot', 'boots', 'footprint', 'footprints', 'prints', 'muddy', 'mud', 'tracks', 'trail', 'walked', 'left', 'corridor'],
        unlockedBy: 'Security'
      },
      {
        description: 'Blunt object with blood residue found hidden nearby - probable murder weapon',
        keywords: ['weapon', 'object', 'heavy', 'struck', 'hit', 'blunt', 'tool', 'metal', 'blood', 'used', 'killed', 'murder'],
        unlockedBy: 'Any'
      }
    ],
    motives: [
      'revenge for a past incident',
      'to cover up their real criminal activity',
      'they were discovered during another crime',
      'personal vendetta and grudge',
      'the victim knew their secret identity'
    ]
  },
  sabotage: {
    descriptionTemplate: (location, time, detail) =>
      `Critical systems in the ${location} have been deliberately damaged at ${time}. ${detail} This could endanger the entire station if not resolved.`,
    possibleDetails: [
      'Main power conduits have been severed with a plasma cutter.',
      'Control panels show signs of forced tampering and circuit overrides.',
      'Vital life support equipment has been destroyed with heavy tools.',
      'Someone disabled the safety protocols through manual bypass.',
      'Critical circuits were deliberately overloaded causing system failure.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `SYSTEMS DAMAGED: ${randomElement([
        `Primary power relay in ${location} destroyed - station running on backup power at 40% capacity.`,
        `Oxygen recycling system sabotaged - ${location} atmospheric controls offline. Emergency reserves engaged.`,
        `Navigation computer in ${location} corrupted - all flight data erased. Backup systems compromised.`,
        `Communication array in ${location} severed - external transmissions blocked for 6 hours.`
      ])}`,
      `METHOD OF SABOTAGE: ${randomElement([
        `Deep tool marks on critical conduits - industrial plasma cutter used. Requires engineering certification to operate.`,
        `Control panel circuit boards physically smashed with heavy object. Forced entry through access hatch detected.`,
        `Safety interlocks manually disabled through maintenance console. Required admin-level credentials and technical knowledge.`,
        `Wiring intentionally crossed to cause power surge. Deliberate rewiring took 10-15 minutes of uninterrupted work.`
      ])}`,
      `TECHNICAL EVIDENCE: ${randomElement([
        `Security access log shows ${location} maintenance hatch opened at ${getTimeMinusMinutes(time, 18)} using Engineer keycard #7.`,
        `Surveillance footage shows someone in maintenance suit entering ${location} at ${getTimeMinusMinutes(time, 25)}. Face obscured by helmet.`,
        `Tool kit found at scene contains plasma cutter (serial #ENG-442) - issued to Engineering department.`,
        `Saboteur left behind industrial-grade wire cutters with partial fingerprint on handle.`
      ])}`,
      `IMMEDIATE IMPACT: ${randomElement([
        `Station emergency systems activated. All non-essential personnel ordered to shelters. Repair time: 4-6 hours.`,
        `Critical systems failure could lead to catastrophic decompression if not repaired within 8 hours.`,
        `Backup generators straining under load - if saboteur strikes again, complete system failure imminent.`,
        `Mission timeline delayed by minimum 48 hours. Command has authorized full investigation.`
      ])}`
    ],
    evidenceTypes: [
      'tool marks on damaged equipment',
      'access logs showing unauthorized entry',
      'disabled security cameras in the area',
      'a wrench with suspicious markings',
      'sabotaged wiring still sparking'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Deep tool marks on conduits - industrial plasma cutter used, requires engineering certification',
        keywords: ['tool', 'tools', 'marks', 'cut', 'cutter', 'plasma', 'equipment', 'damage', 'damaged', 'engineering', 'tamper', 'tampering'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Cut wires and severed cables show deliberate sabotage pattern',
        keywords: ['wire', 'wires', 'cable', 'cables', 'cut', 'severed', 'electrical', 'power', 'sabotage', 'deliberate', 'intentional'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Safety protocols manually disabled through maintenance console - required admin access',
        keywords: ['safety', 'protocol', 'protocols', 'disabled', 'shut', 'down', 'manual', 'override', 'access', 'console', 'admin'],
        unlockedBy: 'Security'
      },
      {
        description: 'Wrench with suspicious markings left at scene - serial number traces to engineering department',
        keywords: ['wrench', 'tool', 'left', 'behind', 'serial', 'number', 'engineering', 'department', 'equipment', 'suspicious'],
        unlockedBy: 'Any'
      },
      {
        description: 'Access logs show unauthorized entry using forged credentials 20 minutes before sabotage',
        keywords: ['access', 'log', 'logs', 'entry', 'unauthorized', 'forged', 'credentials', 'keycard', 'bypass', 'security', 'before'],
        unlockedBy: 'Security'
      }
    ],
    motives: [
      'to create a distraction for their other activities',
      'to delay the station\'s mission',
      'revenge against the station administration',
      'to cause chaos and facilitate escape',
      'following orders from an external party'
    ]
  },
  theft: {
    descriptionTemplate: (location, time, detail) =>
      `A valuable item has been stolen from the ${location} at ${time}. ${detail} Security protocols were bypassed during the theft.`,
    possibleDetails: [
      'A classified data drive containing mission-critical intel is missing.',
      'Prototype quantum processor worth 2.4 million credits has been taken.',
      'Classified navigation codes for secure routes were copied.',
      'Rare xenobiological samples worth millions have vanished.',
      'Commander\'s personal safe containing classified documents was cracked.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `STOLEN ITEM: ${randomElement([
        `Classified data drive (ID: SEC-7742) containing station defense protocols and crew personnel files. Value: Priceless - contents could compromise entire operation.`,
        `Experimental quantum processor prototype (Project Helix). Only 3 units exist. Black market value estimated at 2.4 million credits.`,
        `Medical nanite samples (Batch MED-991) - unauthorized use could create biological weapons. Stored under triple-lock security.`,
        `Navigation data core containing classified jump coordinates. Unauthorized possession is treason under Galactic Law Article 47.`
      ])}`,
      `ACCESS METHOD: ${randomElement([
        `Security vault in ${location} shows pry marks - breached using industrial lock pick set. Alarm system disabled from maintenance panel at ${getTimeMinusMinutes(time, 6)}.`,
        `Biometric scanner bypassed using forged security credentials. Access log shows "Chief Engineer" keycard used, but chief was in Med Bay at the time.`,
        `Electronic lock on storage container hacked - found micro-computer splice attached to security circuit. Required advanced technical knowledge.`,
        `Safe combination cracked through brute force method. Lock mechanism shows repeated entry attempts starting at ${getTimeMinusMinutes(time, 35)}.`
      ])}`,
      `SECURITY BREACH: ${randomElement([
        `Surveillance cameras in ${location} experienced 4-minute gap from ${getTimeMinusMinutes(time, 4)} to ${time} - video feed looped using maintenance override code.`,
        `Motion sensors in ${location} were deactivated at ${getTimeMinusMinutes(time, 8)}. Reactivation log shows manual reset from inside the room.`,
        `Pressure-sensitive floor alarm disabled. Security log shows system diagnostics run from terminal outside ${location} at ${getTimeMinusMinutes(time, 12)}.`,
        `Anti-tamper seal on vault broken. Forensics found tool marks matching standard engineering kit wrench (15mm).`
      ])}`,
      `INVESTIGATION NOTES: ${randomElement([
        `Thief knew exact location of target - suggests inside knowledge. Only 6 crew members had access to storage manifest.`,
        `Estimated time to complete theft: 3-4 minutes. Perpetrator moved quickly and knew exactly what they were looking for.`,
        `No forced entry on main door - thief had valid access credentials or was let in by accomplice.`,
        `Security Chief confirms this level of security breach requires engineering AND security clearance knowledge.`
      ])}`
    ],
    evidenceTypes: [
      'pry marks on the storage container',
      'a disabled alarm system',
      'forged access credentials',
      'tampered lock mechanism',
      'security footage gap during the theft'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Pry marks on storage container - industrial lock pick set used to breach security',
        keywords: ['pry', 'marks', 'forced', 'lock', 'pick', 'breach', 'container', 'storage', 'opened', 'broken', 'jimmied'],
        unlockedBy: 'Security'
      },
      {
        description: 'Alarm system disabled from maintenance panel 6 minutes before theft',
        keywords: ['alarm', 'alarms', 'disabled', 'turned off', 'deactivated', 'maintenance', 'panel', 'security', 'system', 'bypassed'],
        unlockedBy: 'Security'
      },
      {
        description: 'Forged security credentials used - keycard shows "Chief Engineer" but chief was elsewhere',
        keywords: ['forged', 'fake', 'credentials', 'keycard', 'badge', 'access', 'card', 'security', 'bypassed', 'stolen', 'cloned'],
        unlockedBy: 'Security'
      },
      {
        description: 'Lock mechanism hacked - micro-computer splice attached to security circuit',
        keywords: ['lock', 'hacked', 'computer', 'splice', 'circuit', 'electronic', 'technical', 'bypass', 'tamper', 'device'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Security footage shows 4-minute gap - video feed looped using maintenance override',
        keywords: ['footage', 'video', 'gap', 'missing', 'looped', 'camera', 'cameras', 'surveillance', 'disabled', 'override'],
        unlockedBy: 'Security'
      }
    ],
    motives: [
      'selling secrets to rival organizations',
      'personal financial gain',
      'blackmail material against crew',
      'completing a hired mission',
      'stealing technology for their own use'
    ]
  },
  smuggling: {
    descriptionTemplate: (location, time, detail) =>
      `Contraband has been discovered in the ${location} at ${time}. ${detail} Someone has been trafficking illegal materials aboard the station.`,
    possibleDetails: [
      'Banned narcotics worth 500K credits were found hidden in maintenance panels.',
      'Illegal weapons cache including 8 plasma rifles was uncovered.',
      'Unauthorized experimental bio-samples detected in cryo-storage.',
      'Stolen military-grade equipment from Mars Station discovered.',
      'Prohibited AI core processor found in concealed floor compartment.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `CONTRABAND DISCOVERED: ${randomElement([
        `Narcotics cache (est. 12kg of Hyper-Stim) hidden behind false wall panel in ${location}. Street value: 500,000 credits. Packaging indicates off-world origin.`,
        `Weapons arsenal discovered in ${location} storage crate marked "Medical Supplies." Contents: 8 plasma rifles, 40 energy cells, 2 EMP grenades. All serial numbers filed off.`,
        `Illegal bio-samples (xenomorph genetic material) found in unauthorized cryo-unit in ${location}. Galactic Health Code violation - Class A felony.`,
        `Stolen military communication equipment (Project Blackout encryption system) recovered from hidden compartment in ${location}. Reported missing from Mars Base 3 months ago.`
      ])}`,
      `CONCEALMENT METHOD: ${randomElement([
        `False bottom discovered in ${location} storage locker #47. Compartment accessed via hidden magnetic release. Required insider knowledge of station layout.`,
        `Contraband hidden inside hollowed-out equipment containers. Shipping manifest lists contents as "Replacement Parts" - weight discrepancy of 47kg not flagged.`,
        `Secret compartment built into ${location} wall structure during recent renovation. Construction records show unauthorized modifications by unknown crew member.`,
        `Items concealed in standard supply crates with legitimate goods on top. X-ray shielding material detected - designed to avoid security scans.`
      ])}`,
      `TRAFFICKING EVIDENCE: ${randomElement([
        `Encrypted communication logs found on datapad in ${location}. Decoded messages reference "shipment arriving Tuesday" and coordinates for dead-drop location.`,
        `Forged shipping manifests discovered - 6 supply containers logged as "delivered" but never scanned into station inventory. Records altered in system at ${getTimeMinusMinutes(time, 120)}.`,
        `Hidden ledger found detailing transactions worth 2.3 million credits over 8 months. Codenames used: "Phantom," "Echo-6," "Nightfall."`,
        `Security footage from Cargo Bay shows crew member moving unmarked crates to ${location} at ${getTimeMinusMinutes(time, 180)}. Face partially visible - matches physical description of 2 crew members.`
      ])}`,
      `OPERATIONAL SCOPE: ${randomElement([
        `Intelligence suggests this is part of larger smuggling ring operating across 4 stations. Our station identified as distribution hub.`,
        `Financial records show irregular payments to crew member's off-station account - total: 340,000 credits deposited over 6 months.`,
        `Evidence indicates smuggler has accomplice who handles security system bypasses. Two-person operation minimum.`,
        `Analysis shows trafficking operation required access to: Cargo manifests, Security schedules, Docking bay codes. Suggests crew member with elevated clearance.`
      ])}`
    ],
    evidenceTypes: [
      'hidden storage compartment',
      'false shipping manifests',
      'coded communication logs',
      'suspicious packaging materials',
      'traces of prohibited substances'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Hidden storage compartment with false bottom discovered - accessed via magnetic release',
        keywords: ['hidden', 'compartment', 'storage', 'false', 'bottom', 'secret', 'concealed', 'magnetic', 'release', 'panel'],
        unlockedBy: 'Security'
      },
      {
        description: 'False shipping manifests found - containers logged as delivered but never scanned into inventory',
        keywords: ['manifest', 'manifests', 'shipping', 'false', 'forged', 'fake', 'documents', 'cargo', 'containers', 'inventory'],
        unlockedBy: 'Any'
      },
      {
        description: 'Encrypted communication logs reference "shipment arriving" and coordinates for dead-drop',
        keywords: ['communication', 'communications', 'logs', 'messages', 'encrypted', 'coded', 'transmissions', 'datapad', 'shipment'],
        unlockedBy: 'Security'
      },
      {
        description: 'X-ray shielding material found - designed to hide contraband from security scans',
        keywords: ['shield', 'shielding', 'xray', 'x-ray', 'scan', 'scanner', 'security', 'hide', 'avoid', 'detection'],
        unlockedBy: 'Security'
      },
      {
        description: 'Traces of prohibited substances detected on packaging materials and containers',
        keywords: ['traces', 'residue', 'substance', 'substances', 'prohibited', 'illegal', 'contraband', 'packaging', 'detected'],
        unlockedBy: 'Medical'
      }
    ],
    motives: [
      'running a profitable black market operation',
      'supplying illegal items to other stations',
      'building a personal arsenal',
      'financing their real agenda',
      'preparing for a larger criminal operation'
    ]
  },
  espionage: {
    descriptionTemplate: (location, time, detail) =>
      `Classified information has been leaked from the ${location} at ${time}. ${detail} A spy has been transmitting sensitive data off-station.`,
    possibleDetails: [
      'Encrypted quantum messages to enemy faction were intercepted by signals intelligence.',
      'Level-5 classified files were accessed without proper authorization codes.',
      'Station defense protocols and security systems were compromised.',
      'Someone copied all classified research data to external drive.',
      'Communication arrays detected unauthorized high-frequency transmissions.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `LEAKED INTELLIGENCE: ${randomElement([
        `Classified defense protocols (Code Omega-7) accessed from ${location} terminal at ${getTimeMinusMinutes(time, 35)}. Data includes: shield frequencies, weapons systems, crew deployment. Downloaded to external device.`,
        `Research data on experimental propulsion system (Project Lightspeed) copied from secured ${location} database. 847 files totaling 12.4TB transferred to unknown recipient.`,
        `Personnel files for all crew members accessed - medical records, psychological evaluations, family details. Clear intelligence gathering operation targeting crew vulnerabilities.`,
        `Station security codes, patrol schedules, and camera blind spots compiled into comprehensive dossier. Intelligence package transmitted off-station via encrypted burst transmission.`
      ])}`,
      `TRANSMISSION DETECTED: ${randomElement([
        `Communications array in ${location} used to send encrypted quantum transmission at ${time}. Signal traced to coordinates in neutral space - suspected enemy rendezvous point.`,
        `Hidden micro-transmitter discovered embedded in ${location} wall panel. Device active for 6 weeks, transmitting data bursts during crew sleep cycles.`,
        `Unauthorized satellite uplink detected from ${location} at ${getTimeMinusMinutes(time, 15)}. 2.3GB encrypted data package sent before security lockout engaged.`,
        `Modified personal datapad found in ${location} with military-grade encryption module. Communication logs show 47 transmissions to off-station contact "Handler-9."`
      ])}`,
      `ACCESS METHOD: ${randomElement([
        `Spy used stolen admin credentials (Captain's access code) to bypass ${location} security. Credentials obtained via keylogger installed 3 weeks ago.`,
        `Biometric scanner in ${location} shows 3 failed access attempts followed by successful entry using forged retinal pattern. Advanced counterintelligence training evident.`,
        `Security footage from ${location} shows crew member accessing classified terminal at ${getTimeMinusMinutes(time, 42)}. They knew exact location of surveillance blind spot.`,
        `System logs reveal backdoor installed in ${location} network 8 months ago. Allowed spy remote access to all classified databases without triggering alarms.`
      ])}`,
      `OPERATIONAL ANALYSIS: ${randomElement([
        `Intelligence assessment: This is professional espionage operation. Spy has tradecraft training - operational security, countersurveillance, dead drops.`,
        `Financial investigation reveals crew member received 6 wire transfers (total 750K credits) from shell company linked to hostile foreign power.`,
        `Behavioral analysis indicates spy has been deep cover for months. Built trusted relationships, gained security clearances, avoided suspicion.`,
        `Evidence suggests spy recruited by enemy intelligence service. Mission objectives: gather military secrets, identify station weaknesses, report crew movements.`
      ])}`
    ],
    evidenceTypes: [
      'unauthorized data transfers',
      'hidden communication device',
      'encrypted files on a personal terminal',
      'suspicious access patterns',
      'coded messages in personal logs'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Unauthorized data transfers detected - 12.4TB copied to external drive then transmitted off-station',
        keywords: ['data', 'transfer', 'transfers', 'download', 'downloaded', 'copied', 'external', 'drive', 'files', 'transmitted'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Hidden micro-transmitter embedded in wall panel - active for 6 weeks transmitting data bursts',
        keywords: ['transmitter', 'device', 'hidden', 'embedded', 'wall', 'panel', 'transmit', 'transmitting', 'signal', 'communication'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Encrypted files on personal terminal - military-grade encryption with off-station contact logs',
        keywords: ['encrypted', 'files', 'encryption', 'terminal', 'computer', 'datapad', 'logs', 'classified', 'secret', 'coded'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Suspicious access patterns show repeated late-night database queries for classified information',
        keywords: ['access', 'pattern', 'patterns', 'suspicious', 'unusual', 'database', 'queries', 'classified', 'logs', 'unauthorized'],
        unlockedBy: 'Security'
      },
      {
        description: 'Coded messages in personal logs reference Handler-9 and intelligence dead-drops',
        keywords: ['coded', 'messages', 'logs', 'personal', 'handler', 'contact', 'intelligence', 'spy', 'agent', 'communication'],
        unlockedBy: 'Any'
      }
    ],
    motives: [
      'working as a double agent',
      'selling secrets to the highest bidder',
      'gathering intelligence for a rival faction',
      'attempting corporate espionage',
      'political sabotage mission'
    ]
  },
  poisoning: {
    descriptionTemplate: (location, time, detail) =>
      `A crew member has fallen critically ill from poisoning traced to the ${location} at ${time}. ${detail} The toxin was deliberately administered.`,
    possibleDetails: [
      'Medical analysis confirms acute toxin exposure - victim in critical condition.',
      'Food supplies in the galley were tampered with neurotoxin.',
      'Hazardous industrial solvent introduced to ventilation system.',
      'Prescription medication replaced with lethal chemical compound.',
      'Water supply contaminated with biological agent.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `VICTIM STATUS: ${randomElement([
        `Lieutenant Chen collapsed in ${location} at ${time}. Symptoms: severe convulsions, respiratory distress, dilated pupils. Med Bay reports critical condition - 68% survival probability.`,
        `Engineer Foster found unconscious in ${location}. Toxicology scan shows neurotoxin in bloodstream. Antidote administered - victim stable but incapacitated for 48 hours.`,
        `Dr. Martinez reported severe nausea and cardiac arrhythmia at ${time}. Blood analysis confirms synthetic poison - not found in standard medical database.`,
        `Security Officer Blake rushed to Med Bay from ${location} with acute poisoning symptoms. Doctor confirms deliberate toxin exposure - investigating source.`
      ])}`,
      `TOXIN IDENTIFIED: ${randomElement([
        `Chemical analysis identifies compound as Tetrodotoxin derivative (TTX-7) - lethal in doses above 2mg. Requires specialized chemistry knowledge to synthesize.`,
        `Biological toxin matches Ricin protein structure. Found in 3 locations: victim's coffee cup, ${location} water dispenser, and break room sink.`,
        `Industrial solvent Methyl Ethyl Ketone detected in air filters. NOT standard station chemical - someone smuggled it aboard specifically for this purpose.`,
        `Toxicology identifies rare botanical poison from off-world plant species. Only source on station: xenobiology lab secured samples.`
      ])}`,
      `ADMINISTRATION METHOD: ${randomElement([
        `Poison found in victim's personal coffee mug in ${location}. Residue on cup rim - administered within 15 minutes of symptoms. Security checking who had access to victim's locker.`,
        `Contaminated food discovered in sealed container in ${location} refrigeration unit. Tampering occurred between ${getTimeMinusMinutes(time, 90)} and ${getTimeMinusMinutes(time, 45)} based on preservation analysis.`,
        `Ventilation panel in ${location} shows signs of forced entry. Toxin dispersal device found hidden in ductwork - timer set for ${getTimeMinusMinutes(time, 8)}.`,
        `Victim's prescription medication bottle from ${location} med cabinet contains substituted pills. Original medication replaced with toxic lookalike - required medical storage access.`
      ])}`,
      `FORENSIC EVIDENCE: ${randomElement([
        `Empty toxin vial (5ml capacity) recovered from ${location} waste chute. Partial fingerprint on glass - running through crew database.`,
        `Chemical trace analysis shows poisoner wore latex gloves - found residue on ${location} door handle and storage cabinet.`,
        `Security footage shows person in medical scrubs entering ${location} at ${getTimeMinusMinutes(time, 30)}. Face partially obscured - appears to be approximately 5'8\" tall.`,
        `Syringe mark found on victim's food package seal - microscopic puncture consistent with injection method. Poisoner had steady hand and medical training.`
      ])}`
    ],
    evidenceTypes: [
      'empty vial of toxic substance',
      'tampered food containers',
      'contaminated medical supplies',
      'traces of poison on surfaces',
      'suspicious chemical residue'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Empty toxin vial (5ml capacity) recovered from waste chute - partial fingerprint on glass',
        keywords: ['vial', 'bottle', 'container', 'toxin', 'poison', 'empty', 'glass', 'fingerprint', 'fingerprints', 'found'],
        unlockedBy: 'Security'
      },
      {
        description: 'Tampered food containers discovered - microscopic injection marks on sealed packaging',
        keywords: ['food', 'tampered', 'contaminated', 'container', 'containers', 'packaging', 'sealed', 'injection', 'changed', 'modified'],
        unlockedBy: 'Any'
      },
      {
        description: 'Contaminated medical supplies found - prescription medication replaced with toxic lookalike',
        keywords: ['medical', 'supplies', 'medication', 'medicine', 'pills', 'contaminated', 'replaced', 'toxic', 'substituted', 'cabinet'],
        unlockedBy: 'Medical'
      },
      {
        description: 'Traces of poison detected on surfaces - chemical residue found on door handle and cabinet',
        keywords: ['traces', 'poison', 'residue', 'chemical', 'substance', 'surface', 'surfaces', 'door', 'handle', 'cabinet', 'detected'],
        unlockedBy: 'Medical'
      },
      {
        description: 'Suspicious chemical residue and latex glove traces indicate poisoner used protective equipment',
        keywords: ['chemical', 'residue', 'suspicious', 'latex', 'glove', 'gloves', 'protective', 'equipment', 'wore', 'traces'],
        unlockedBy: 'Medical'
      }
    ],
    motives: [
      'eliminating a threat to their operation',
      'testing biological weapons',
      'creating medical emergencies as cover',
      'targeting a specific individual',
      'demonstrating their power and control'
    ]
  },
  arson: {
    descriptionTemplate: (location, time, detail) =>
      `A fire was deliberately started in the ${location} at ${time}. ${detail} Fire suppression systems were disabled before the incident.`,
    possibleDetails: [
      'Chemical accelerants were used to rapidly spread the fire.',
      'Fire suppression systems were manually shut down 10 minutes before ignition.',
      'Three separate ignition points detected - clear evidence of premeditation.',
      'Critical data servers and backup systems specifically targeted for destruction.',
      'Forensic analysis confirms fire was intentionally set with incendiary device.'
    ],
    evidenceGenerator: (location, time, detail) => [
      `FIRE ANALYSIS: ${randomElement([
        `Fire originated in ${location} at precisely ${time}. Three distinct ignition points detected: electrical panel, storage area, ventilation duct. Synchronized timing indicates deliberate planning.`,
        `Burn pattern analysis shows fire spread unusually fast - consistent with accelerant use. Temperature readings peaked at 1,400°C, far exceeding normal combustion.`,
        `Fire marshal reports damage concentrated on critical systems: main data core, backup servers, communication relay. Strategic targeting evident - not random arson.`,
        `Forensics confirms fire started simultaneously at multiple locations in ${location}. Used timed incendiary devices set for ${time} detonation.`
      ])}`,
      `ACCELERANT DETECTED: ${randomElement([
        `Chemical analysis of burn residue identifies tri-methyl accelerant - military-grade fire starter. Not available in civilian markets. Requires specialized procurement.`,
        `Traces of plasma gel found at ignition sites in ${location}. This accelerant burns at extreme temperatures and cannot be extinguished with standard fire suppression.`,
        `Lab confirms presence of thermite compound mixed with oxidizers. Professional arson technique - designed to destroy evidence and maximize damage.`,
        `Residue analysis shows combination of liquid accelerant and solid fuel tablets. Arsonist had chemistry knowledge to create custom burn mixture.`
      ])}`,
      `SUPPRESSION SABOTAGE: ${randomElement([
        `Fire suppression system in ${location} manually disabled at ${getTimeMinusMinutes(time, 10)}. Override command entered from maintenance terminal using Engineer credentials.`,
        `Halon gas canisters in ${location} were deliberately emptied 2 hours before fire. Saboteur knew fire suppression system operation intimately.`,
        `Smoke detectors in ${location} found with disconnected power supplies. Arsonist systematically disabled all fire safety systems before ignition.`,
        `Emergency bulkheads programmed to remain open during fire - normally they seal automatically. System override required admin-level security access.`
      ])}`,
      `EVIDENCE RECOVERED: ${randomElement([
        `Partially melted timing device found in ${location} debris. Electronic signature matches military-spec remote detonator. Serial number traced to Station armory inventory.`,
        `Boot prints in soot leading away from ${location} toward maintenance tunnels. Tread pattern matches standard-issue engineering boots (size 9).`,
        `Surveillance shows crew member in fireproof suit entering ${location} at ${getTimeMinusMinutes(time, 18)}. Left carrying equipment case 4 minutes later.`,
        `Arsonist left behind empty accelerant containers in air duct. Partial fingerprint recovered from container seal - matches crew database profile.`
      ])}`
    ],
    evidenceTypes: [
      'traces of accelerant',
      'disabled fire suppression controls',
      'burnt matchsticks or ignition device',
      'tampered smoke detectors',
      'suspicious burn patterns'
    ],
    hiddenEvidenceGenerator: () => [
      {
        description: 'Traces of accelerant detected in burn residue - military-grade fire starter identified',
        keywords: ['accelerant', 'traces', 'residue', 'chemical', 'fuel', 'starter', 'fire', 'burn', 'detected', 'found'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Fire suppression system manually disabled - override command entered from maintenance terminal',
        keywords: ['suppression', 'fire', 'system', 'disabled', 'shut', 'down', 'override', 'maintenance', 'terminal', 'halon', 'sprinkler'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Partially melted timing device found in debris - military-spec remote detonator',
        keywords: ['device', 'timer', 'timing', 'detonator', 'ignition', 'remote', 'melted', 'burnt', 'found', 'debris'],
        unlockedBy: 'Engineer'
      },
      {
        description: 'Tampered smoke detectors with disconnected power supplies found throughout area',
        keywords: ['smoke', 'detector', 'detectors', 'alarm', 'alarms', 'tampered', 'disabled', 'disconnected', 'power', 'safety'],
        unlockedBy: 'Security'
      },
      {
        description: 'Suspicious burn patterns indicate multiple ignition points - evidence of deliberate arson',
        keywords: ['burn', 'pattern', 'patterns', 'suspicious', 'multiple', 'ignition', 'points', 'arson', 'deliberate', 'intentional', 'fire'],
        unlockedBy: 'Any'
      }
    ],
    motives: [
      'destroying evidence of their crimes',
      'creating chaos and distraction',
      'sabotaging the station\'s operations',
      'insurance fraud scheme',
      'personal vendetta against the facility'
    ]
  }
};

const TIMES = [
  '02:15', '03:30', '06:45', '08:20', '10:15', '11:45',
  '13:30', '14:45', '16:20', '18:00', '20:30', '22:15', '23:45'
];

export function generateScenario(): CrimeScenario {
  const crimeType = randomElement<CrimeType>(['murder', 'sabotage', 'theft', 'smuggling', 'espionage', 'poisoning', 'arson']);
  const location = randomElement(LOCATIONS);
  const timeOfCrime = randomElement(TIMES);
  const template = CRIME_TEMPLATES[crimeType];

  const detail = randomElement(template.possibleDetails);
  const description = template.descriptionTemplate(location.name, timeOfCrime, detail);

  const detailedEvidence = template.evidenceGenerator(location.name, timeOfCrime, detail);

  const initialClues = [
    `Time of Incident: ${timeOfCrime}`,
    `Location: ${location.name}`,
    `Access Level: ${location.accessLevel === 'secure' ? 'SECURE - Restricted to authorized personnel only' : location.accessLevel === 'restricted' ? 'RESTRICTED - Limited crew access' : 'PUBLIC - Accessible to all crew members'}`,
  ];

  const hiddenEvidenceData = template.hiddenEvidenceGenerator();
  const selectedHiddenEvidence = hiddenEvidenceData.slice(0, 3);

  const hiddenEvidence: Evidence[] = selectedHiddenEvidence.map((evidence, index) => ({
    id: `hidden-${index}`,
    description: evidence.description,
    linkedTo: null,
    keywords: evidence.keywords,
    unlockedBy: evidence.unlockedBy,
    discoveryQuestion: `Can you tell me more about what you saw or found?`
  }));

  const motive = randomElement(template.motives);

  let stolenItem;
  let victim;

  if (crimeType === 'theft' || crimeType === 'smuggling') {
    stolenItem = detail;
  }

  if (crimeType === 'murder' || crimeType === 'poisoning') {
    victim = randomElement(VICTIMS);
  }

  return {
    crimeType,
    location,
    timeOfCrime,
    victim,
    stolenItem,
    description,
    initialClues,
    detailedEvidence,
    hiddenEvidence,
    motive
  };
}

export function getCrimeTypeLabel(crimeType: CrimeType): string {
  const labels: Record<CrimeType, string> = {
    murder: 'MURDER',
    sabotage: 'SABOTAGE',
    theft: 'THEFT',
    smuggling: 'SMUGGLING',
    espionage: 'ESPIONAGE',
    poisoning: 'POISONING',
    arson: 'ARSON'
  };
  return labels[crimeType];
}

export function getCrimeTypeColor(crimeType: CrimeType): string {
  const colors: Record<CrimeType, string> = {
    murder: 'text-red-500',
    sabotage: 'text-orange-500',
    theft: 'text-yellow-500',
    smuggling: 'text-purple-500',
    espionage: 'text-blue-500',
    poisoning: 'text-green-500',
    arson: 'text-red-600'
  };
  return colors[crimeType];
}
