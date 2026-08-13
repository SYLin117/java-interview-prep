// networking.js — data for the Networking view (final-round network-engineer prep).
//
// Ported from a personal 5-hour study guide written for an interview whose scope
// the hiring manager pinned to OSI layers 1, 2 and 3. Three exported arrays:
//
//   networkingGuide     expandable reference cards (the study material itself)
//   networkingQuestions Q&A drills — model answers, grouped into sections
//   networkingDrill     the 60-second recall drill (prompt → answer flashcards)
//
// All HTML fields are injected via innerHTML, so angle brackets inside the
// content must be written as &lt; / &gt; entities — including inside the ASCII
// diagrams in <pre> blocks.

/**
 * Reference cards. One expandable card per topic.
 *   layer   groups the card in the "Layer" filter dropdown — keep the strings
 *           identical across cards that belong together, the options are built
 *           from whatever appears here.
 *   blocks  labelled sections inside the expanded card: { t: title, h: html }.
 */
const networkingGuide = [
  {
    id: 'net-priority',
    icon: '🎯',
    layer: 'Foundations',
    title: 'Scope & Priority Block',
    tagline: 'The six topics the hiring manager named, and how to handle a group interview.',
    explain: `The hiring manager told you the scope, which is a gift — you don't have to guess what to study. Six topics, all at layers 1 to 3, and he already knows networking isn't your background. Your job is to be crisp on the fundamentals, not encyclopedic.`,
    tags: ['scope', 'strategy'],
    blocks: [
      { t: 'What was actually asked for', h: `<p>Scope confirmed by the hiring manager: <strong>OSI layers 1, 2 and 3</strong>. He named six topics explicitly:</p>
<ol>
<li><strong>L2 frame format</strong> — draw the Ethernet frame, field by field</li>
<li><strong>IP packet format</strong> — draw the IPv4 header, field by field</li>
<li><strong>How a switch learns and forwards</strong> — learn / flood / forward / filter</li>
<li><strong>STP</strong> — why loops are fatal, how the root is elected</li>
<li><strong>How a router forwards</strong> — the seven steps and the MAC rewrite</li>
<li><strong>Basic routing protocols</strong> — distance vector vs link state, OSPF</li>
</ol>
<p>Everything else in this view is supporting depth. If time is short, the six above <em>are</em> the interview.</p>` },
      { t: 'He already knows networking is not your background', h: `<p>That lowers the bar on obscurity and raises it on fundamentals. Being crisp and correct on the basics beats name-dropping BGP communities.</p>
<p>When you don't know something: <em>"I haven't worked with that directly — here's what I understand about it"</em> and then <strong>stop</strong>. In a group interview a confident wrong answer is worse than a short honest one, because someone else in the room usually knows.</p>` },
      { t: 'Group interview tactics', h: `<ul>
<li><strong>Answer in two levels.</strong> Give the direct answer in one or two sentences, then stop. Add depth only if they follow up — long monologues in a group setting cost you.</li>
<li><strong>If another candidate answers first</strong>, don't repeat them. Add the one thing they left out, or say you'd approach it the same way and name the exception.</li>
<li><strong>When you don't know:</strong> "I haven't worked with that. My understanding is X, but I'd want to verify it." Then stop talking.</li>
<li>He's testing whether you <em>prepared</em>, not whether you're already a network engineer. Precision on frames, MAC learning, STP and routing is the entire assignment.</li>
</ul>` },
      { t: 'Study order', h: `<p><strong>If you have 5 hours</strong></p>
<ol>
<li>The priority material — Ethernet frame, IP header, switch learning, STP, router forwarding, routing protocols — <strong>2.5 h</strong>. Draw the frame and the IP header from memory until you can do both cold.</li>
<li>Subnetting — <strong>1 h</strong>. He didn't name it, but it's L3 and it will come up.</li>
<li>Switching &amp; routing reinforcement — <strong>45 min</strong>.</li>
<li>The Q&amp;A drills out loud, timed — <strong>45 min</strong>.</li>
</ol>
<p><strong>If you have 2 hours</strong></p>
<ol>
<li>Ethernet frame + IP header — 30 min. Draw both, twice</li>
<li>Switch learning, including the worked example — 20 min</li>
<li>STP: root election, why loops kill a LAN — 25 min</li>
<li>Router forwarding + the end-to-end MAC/IP walk table — 25 min</li>
<li>Priority Q&amp;A out loud — 20 min</li>
</ol>
<p><strong>If you have 60 minutes</strong></p>
<ol>
<li>The end-to-end walk table: MACs change, IPs don't, TTL drops — 10 min</li>
<li>Ethernet frame fields and IP header fields — 15 min</li>
<li>Learn / flood / forward / filter, plus the worked example — 10 min</li>
<li>STP: why loops are fatal, how root is elected — 10 min</li>
<li>Five Q&amp;A out loud — 15 min</li>
</ol>` }
    ]
  },
  {
    id: 'net-glossary',
    icon: '📖',
    layer: 'Foundations',
    title: 'Glossary — every abbreviation on this page',
    tagline: 'Networking is dense with three-letter acronyms. Here is what each one stands for and what it actually means.',
    explain: `Networking people abbreviate everything, and a lot of interview anxiety is really just not knowing what a word stands for. Read this card once before anything else; then any acronym you meet later is a thing you half-recognise rather than a wall.`,
    tags: ['glossary', 'acronyms'],
    blocks: [
      { t: 'The models and the basics', h: `<table class="net-table"><thead><tr><th>Short</th><th>Stands for</th><th>In plain English</th></tr></thead><tbody>
<tr><td><strong>OSI</strong></td><td>Open Systems Interconnection</td><td>The 7-layer model everyone teaches. A way of splitting "get this data over there" into seven separate jobs</td></tr>
<tr><td><strong>PDU</strong></td><td>Protocol Data Unit</td><td>The generic word for "the chunk of data at this layer". At L2 it's a frame, at L3 a packet, at L4 a segment</td></tr>
<tr><td><strong>LAN / WAN</strong></td><td>Local / Wide Area Network</td><td>Your building versus the links between buildings and cities</td></tr>
<tr><td><strong>NIC</strong></td><td>Network Interface Card</td><td>The network port on a machine — physical or virtual</td></tr>
<tr><td><strong>RFC</strong></td><td>Request For Comments</td><td>The numbered documents that <em>are</em> the internet standards. "RFC 1918 addresses" just means "the private address ranges"</td></tr>
<tr><td><strong>IEEE</strong></td><td>Institute of Electrical and Electronics Engineers</td><td>The body that standardises the 802.x things: 802.3 is Ethernet, 802.1Q is VLAN tagging, 802.11 is Wi-Fi</td></tr>
<tr><td><strong>ASIC / NPU</strong></td><td>Application-Specific Integrated Circuit / Network Processing Unit</td><td>Purpose-built chips. "It's done in ASIC" means "in hardware, at full speed" as opposed to in software on a CPU</td></tr>
<tr><td><strong>QoS</strong></td><td>Quality of Service</td><td>Deliberately treating some traffic better than other traffic — voice before file transfers</td></tr>
<tr><td><strong>RTT</strong></td><td>Round-Trip Time</td><td>How long a packet takes to get there and back. What ping prints</td></tr>
</tbody></table>` },
      { t: 'Layer 1 — physical', h: `<table class="net-table"><thead><tr><th>Short</th><th>Stands for</th><th>In plain English</th></tr></thead><tbody>
<tr><td><strong>SFP / SFP+ / QSFP</strong></td><td>Small Form-factor Pluggable (+ = enhanced, Q = Quad)</td><td>The little plug-in modules a fiber cable connects to. SFP is 1 gig, SFP+ 10 gig, QSFP28 100 gig</td></tr>
<tr><td><strong>MMF / SMF</strong></td><td>Multi-Mode Fiber / Single-Mode Fiber</td><td>Fat-core fiber for short runs inside a building vs thin-core fiber with a laser for long distances</td></tr>
<tr><td><strong>PoE</strong></td><td>Power over Ethernet</td><td>Sending electrical power down the same network cable, so a phone or camera needs only one cable</td></tr>
<tr><td><strong>EMI</strong></td><td>Electromagnetic Interference</td><td>Electrical noise from motors, welders, fluorescent lights. It corrupts copper signals; fiber is immune, which is why factories use fiber</td></tr>
<tr><td><strong>CSMA/CD</strong></td><td>Carrier Sense Multiple Access with Collision Detection</td><td>The old "listen before you talk, and back off if two of us talk at once" scheme. Only relevant to half duplex, which is history</td></tr>
<tr><td><strong>Auto-MDIX</strong></td><td>Automatic Medium-Dependent Interface Crossover</td><td>The switch works out for itself whether the cable is wired straight-through or crossover. It's why nobody carries crossover cables anymore</td></tr>
</tbody></table>` },
      { t: 'Layer 2 — switching', h: `<table class="net-table"><thead><tr><th>Short</th><th>Stands for</th><th>In plain English</th></tr></thead><tbody>
<tr><td><strong>MAC</strong></td><td>Media Access Control (address)</td><td>The 48-bit hardware address burned into a network card. Only meaningful on the local network</td></tr>
<tr><td><strong>OUI</strong></td><td>Organizationally Unique Identifier</td><td>The first half of a MAC address, which identifies the manufacturer</td></tr>
<tr><td><strong>FCS / CRC</strong></td><td>Frame Check Sequence / Cyclic Redundancy Check</td><td>The checksum at the end of a frame, and the maths used to compute it. Mismatch means the frame got corrupted, so it's silently dropped</td></tr>
<tr><td><strong>CAM table</strong></td><td>Content-Addressable Memory table</td><td>The switch's list of "which MAC address is out of which port". Also just called the MAC address table</td></tr>
<tr><td><strong>VLAN</strong></td><td>Virtual LAN</td><td>A separate network drawn in software on top of shared switches</td></tr>
<tr><td><strong>802.1Q</strong></td><td>(IEEE standard number)</td><td>The 4-byte tag added to a frame that says which VLAN it belongs to. "Dot1Q" in speech</td></tr>
<tr><td><strong>SVI</strong></td><td>Switched Virtual Interface</td><td>A virtual router interface inside a switch, acting as the gateway for one VLAN</td></tr>
<tr><td><strong>STP / RSTP / MST</strong></td><td>Spanning Tree Protocol / Rapid STP / Multiple Spanning Tree</td><td>Loop prevention; the fast version; and the version that handles many VLANs efficiently</td></tr>
<tr><td><strong>BPDU</strong></td><td>Bridge Protocol Data Unit</td><td>The little message switches send each other to build the spanning tree — "here is my ID and my cost to the root"</td></tr>
<tr><td><strong>TCN</strong></td><td>Topology Change Notification</td><td>The BPDU a switch sends when a link changed, so everyone clears stale address entries</td></tr>
<tr><td><strong>LACP / PAgP</strong></td><td>Link Aggregation Control Protocol / Port Aggregation Protocol</td><td>Bundling several cables into one logical link. LACP is the open standard, PAgP is Cisco's</td></tr>
<tr><td><strong>LLDP / CDP</strong></td><td>Link Layer Discovery Protocol / Cisco Discovery Protocol</td><td>Switches announcing "this is who I am and which port you're on", so you can see what's plugged in where</td></tr>
<tr><td><strong>DTP</strong></td><td>Dynamic Trunking Protocol</td><td>Cisco ports negotiating whether the link becomes a trunk. Turn it off — it's a security hole</td></tr>
<tr><td><strong>VTP</strong></td><td>VLAN Trunking Protocol</td><td>Cisco's way of syncing the VLAN list between switches. Famous for wiping every VLAN when it goes wrong</td></tr>
<tr><td><strong>UDLD</strong></td><td>UniDirectional Link Detection</td><td>Catches a fiber that works in only one direction — a failure that would otherwise defeat STP and cause a loop</td></tr>
<tr><td><strong>DAI</strong></td><td>Dynamic ARP Inspection</td><td>Checking ARP replies against a trusted table so nobody can impersonate the gateway</td></tr>
<tr><td><strong>802.1X / RADIUS</strong></td><td>(IEEE standard) / Remote Authentication Dial-In User Service</td><td>The port stays dead until the device logs in; RADIUS is the server that checks the login</td></tr>
<tr><td><strong>ARP</strong></td><td>Address Resolution Protocol</td><td>"Who has this IP address? Tell me your MAC." The bridge between layer 3 and layer 2</td></tr>
<tr><td><strong>MITM</strong></td><td>Man In The Middle</td><td>An attacker who has tricked traffic into flowing through them</td></tr>
</tbody></table>` },
      { t: 'Layer 3 — addressing and routing', h: `<table class="net-table"><thead><tr><th>Short</th><th>Stands for</th><th>In plain English</th></tr></thead><tbody>
<tr><td><strong>TTL</strong></td><td>Time To Live</td><td>A counter in every packet, decremented by each router. At zero the packet is dropped — the safety net against endless loops</td></tr>
<tr><td><strong>IHL</strong></td><td>Internet Header Length</td><td>How long the IP header is. Almost always 20 bytes</td></tr>
<tr><td><strong>DSCP / ECN</strong></td><td>Differentiated Services Code Point / Explicit Congestion Notification</td><td>The QoS priority marking, and a flag routers set to say "I'm getting congested, slow down"</td></tr>
<tr><td><strong>DF / MF</strong></td><td>Don't Fragment / More Fragments</td><td>Two flag bits controlling whether a router may split a large packet, and whether more pieces follow</td></tr>
<tr><td><strong>ICMP</strong></td><td>Internet Control Message Protocol</td><td>The network's error channel. Ping and traceroute are both just ICMP</td></tr>
<tr><td><strong>CIDR</strong></td><td>Classless Inter-Domain Routing</td><td>Writing a network as <code>10.1.1.0/24</code> — the number after the slash is how many bits identify the network</td></tr>
<tr><td><strong>VLSM</strong></td><td>Variable Length Subnet Masking</td><td>Carving one address block into differently-sized pieces instead of equal ones</td></tr>
<tr><td><strong>NAT / PAT</strong></td><td>Network Address Translation / Port Address Translation</td><td>Rewriting addresses as traffic leaves. PAT is the many-devices-share-one-public-address version every home uses</td></tr>
<tr><td><strong>CGNAT</strong></td><td>Carrier-Grade NAT</td><td>Your ISP doing NAT too, so even your "public" address is shared</td></tr>
<tr><td><strong>APIPA</strong></td><td>Automatic Private IP Addressing</td><td>The 169.254.x.x address a machine gives itself when no DHCP server answered</td></tr>
<tr><td><strong>AD</strong></td><td>Administrative Distance</td><td>How much a router trusts each source of routing information. Lower = more trusted</td></tr>
<tr><td><strong>RIB / FIB / CEF</strong></td><td>Routing / Forwarding Information Base, Cisco Express Forwarding</td><td>The full routing table in software; the trimmed copy in hardware; Cisco's name for the latter</td></tr>
<tr><td><strong>IGP / EGP</strong></td><td>Interior / Exterior Gateway Protocol</td><td>Routing protocols used inside one organisation vs between organisations</td></tr>
<tr><td><strong>RIP</strong></td><td>Routing Information Protocol</td><td>The oldest, simplest routing protocol. Counts hops, ignores speed. Know it as the contrast to OSPF</td></tr>
<tr><td><strong>OSPF</strong></td><td>Open Shortest Path First</td><td>The main open-standard routing protocol inside a company. Every router builds a full map and computes its own shortest paths</td></tr>
<tr><td><strong>LSA / LSDB / SPF</strong></td><td>Link State Advertisement / Link State Database / Shortest Path First</td><td>The messages OSPF floods, the map they build, and the algorithm (Dijkstra) run over it</td></tr>
<tr><td><strong>ABR / ASBR</strong></td><td>Area Border Router / Autonomous System Boundary Router</td><td>The router joining two OSPF areas, and the one importing routes from outside</td></tr>
<tr><td><strong>DR / BDR</strong></td><td>Designated Router / Backup Designated Router</td><td>On a shared segment, one elected router everyone talks to instead of everyone talking to everyone</td></tr>
<tr><td><strong>EIGRP / DUAL</strong></td><td>Enhanced Interior Gateway Routing Protocol / Diffusing Update Algorithm</td><td>Cisco's routing protocol and the algorithm that gives it a pre-validated backup route</td></tr>
<tr><td><strong>BGP / AS</strong></td><td>Border Gateway Protocol / Autonomous System</td><td>The protocol that runs the internet between organisations; an AS is one organisation's network with its own number</td></tr>
<tr><td><strong>MED</strong></td><td>Multi-Exit Discriminator</td><td>A BGP hint to a neighbour about which of your links they should prefer</td></tr>
<tr><td><strong>ECMP</strong></td><td>Equal-Cost Multi-Path</td><td>Two equally good routes, so traffic is spread over both</td></tr>
<tr><td><strong>FHRP / HSRP / VRRP / GLBP</strong></td><td>First Hop Redundancy Protocol, Hot Standby / Virtual Router Redundancy / Gateway Load Balancing</td><td>Two routers sharing one gateway address so hosts don't lose their way out if one dies. VRRP is the open standard</td></tr>
<tr><td><strong>NDP / SLAAC</strong></td><td>Neighbor Discovery Protocol / Stateless Address Autoconfiguration</td><td>IPv6's replacement for ARP, and IPv6 hosts building their own address without DHCP</td></tr>
</tbody></table>` },
      { t: 'Layer 4 and above — transport, names, security', h: `<table class="net-table"><thead><tr><th>Short</th><th>Stands for</th><th>In plain English</th></tr></thead><tbody>
<tr><td><strong>TCP / UDP</strong></td><td>Transmission Control Protocol / User Datagram Protocol</td><td>Reliable, ordered, connection-based vs fire-and-forget</td></tr>
<tr><td><strong>SYN / ACK / FIN / RST</strong></td><td>Synchronize / Acknowledge / Finish / Reset</td><td>TCP flags: start a connection, confirm receipt, close politely, and slam the door ("connection refused")</td></tr>
<tr><td><strong>MTU / MSS</strong></td><td>Maximum Transmission Unit / Maximum Segment Size</td><td>The largest packet a link can carry (1500 bytes normally), and the largest chunk of actual data inside it (1460)</td></tr>
<tr><td><strong>PMTUD</strong></td><td>Path MTU Discovery</td><td>The sender working out the smallest MTU anywhere along the path. Breaks silently when firewalls block ICMP</td></tr>
<tr><td><strong>MSL</strong></td><td>Maximum Segment Lifetime</td><td>How long a stray packet could still be wandering the network. TIME_WAIT lasts twice this</td></tr>
<tr><td><strong>DNS</strong></td><td>Domain Name System</td><td>Turning names into addresses</td></tr>
<tr><td><strong>A / AAAA / CNAME / MX / NS / PTR / SOA / SRV / TXT</strong></td><td>(DNS record types)</td><td>Name→IPv4, name→IPv6, alias, mail server, nameserver, reverse lookup, zone info, service location, free text</td></tr>
<tr><td><strong>SPF / DKIM</strong></td><td>Sender Policy Framework / DomainKeys Identified Mail</td><td>TXT records proving an email really came from your domain (unrelated to OSPF's SPF algorithm — same letters, different thing)</td></tr>
<tr><td><strong>DHCP / DORA</strong></td><td>Dynamic Host Configuration Protocol / Discover-Offer-Request-Ack</td><td>How a device is handed an address, and the four messages it takes</td></tr>
<tr><td><strong>TLS / SSL</strong></td><td>Transport Layer Security / Secure Sockets Layer</td><td>The encryption under HTTPS. SSL is the obsolete name people still use out of habit</td></tr>
<tr><td><strong>SNI</strong></td><td>Server Name Indication</td><td>The client saying which hostname it wants <em>before</em> encryption starts, so a server hosting many sites on one IP knows which certificate to present</td></tr>
<tr><td><strong>CN / SAN</strong></td><td>Common Name / Subject Alternative Name</td><td>The hostname(s) a certificate is valid for. Modern clients only look at SAN</td></tr>
<tr><td><strong>CA / mTLS</strong></td><td>Certificate Authority / mutual TLS</td><td>Who vouches for a certificate; and TLS where the <em>client</em> also proves its identity</td></tr>
<tr><td><strong>ECDHE / AES-GCM</strong></td><td>Elliptic Curve Diffie-Hellman Ephemeral / Advanced Encryption Standard - Galois Counter Mode</td><td>How the two sides agree a secret key without transmitting it; and the cipher that then encrypts the data</td></tr>
<tr><td><strong>ACL / NACL / SG</strong></td><td>Access Control List / Network ACL / Security Group</td><td>Firewall rule lists — on a router, on an AWS subnet, and on an AWS instance</td></tr>
<tr><td><strong>NGFW / IPS</strong></td><td>Next-Generation Firewall / Intrusion Prevention System</td><td>Firewalls that inspect application content, not just addresses and ports</td></tr>
<tr><td><strong>XFF</strong></td><td>X-Forwarded-For</td><td>The HTTP header a proxy adds to preserve the original client's IP address</td></tr>
<tr><td><strong>VIP</strong></td><td>Virtual IP</td><td>One address shared by a cluster, which moves to whichever node is alive</td></tr>
<tr><td><strong>IPsec / IKE / SA</strong></td><td>Internet Protocol Security / Internet Key Exchange / Security Association</td><td>Site-to-site VPN encryption, the negotiation that sets it up, and the agreed settings it produces</td></tr>
<tr><td><strong>ALG</strong></td><td>Application Layer Gateway</td><td>A firewall feature that peeks inside protocols which embed IP addresses in their payload (FTP, SIP) and fixes them up through NAT</td></tr>
<tr><td><strong>SNMP / IPFIX / SPAN</strong></td><td>Simple Network Management Protocol / IP Flow Information Export / Switched Port Analyzer</td><td>Polling devices for stats; exporting who-talked-to-whom records; and mirroring traffic to an analyzer</td></tr>
<tr><td><strong>OT</strong></td><td>Operational Technology</td><td>Factory and industrial equipment, as opposed to office IT. Usually old, unpatchable, and kept on its own tightly-restricted VLAN</td></tr>
</tbody></table>` }
    ]
  },
  {
    id: 'net-l1',
    icon: '🔌',
    layer: 'L1 Physical',
    title: 'Layer 1 — Physical',
    tagline: 'Bits on the wire: copper, fiber, transceivers, duplex, and the failures you can see.',
    explain: `Layer 1 is just "how do we physically move a 1 or a 0 from here to there" — copper, light, connectors, voltage. It has no idea what a message is. It moves signals, and that's all.`,
    tags: ['cabling', 'fiber', 'duplex', 'PoE'],
    blocks: [
      { t: 'What L1 does', h: `<p>L1 moves <strong>bits</strong>. It defines connectors, voltages, light, encoding and timing. No addressing, and no idea what a frame is.</p>` },
      { t: 'Copper (twisted pair)', h: `<table class="net-table"><thead><tr><th>Category</th><th>Speed</th><th>Distance</th></tr></thead><tbody>
<tr><td>Cat5e</td><td>1 Gbps</td><td>100 m</td></tr>
<tr><td>Cat6</td><td>1 Gbps (10G to 55 m)</td><td>100 m</td></tr>
<tr><td>Cat6a</td><td>10 Gbps</td><td>100 m</td></tr>
<tr><td>Cat7 / Cat8</td><td>10–40 Gbps</td><td>shorter</td></tr>
</tbody></table>
<p><strong>100 meters is the hard limit</strong> for all of them. Twisting the pairs cancels crosstalk — that's the whole reason the cable is twisted.</p>` },
      { t: 'Fiber', h: `<ul>
<li><strong>Multimode (MMF)</strong> — larger core (50/62.5 µm), LED or VCSEL source, cheaper optics, short distance (OM3 ~300 m at 10G, OM4 ~400 m). Aqua or violet jacket</li>
<li><strong>Single-mode (SMF)</strong> — 9 µm core, laser source, long distance (km to 100 km+). Yellow jacket</li>
<li>Immune to EMI, which is why it's used between buildings and on factory floors near motors and welders</li>
</ul>
<p><strong>Transceivers</strong>: SFP (1G), SFP+ (10G), QSFP+ (40G), QSFP28 (100G). Hot-swappable, matched to the fiber type and wavelength.</p>` },
      { t: 'Duplex and autonegotiation', h: `<ul>
<li><strong>Full duplex</strong> — send and receive simultaneously. Standard everywhere today</li>
<li><strong>Half duplex</strong> — one direction at a time, uses CSMA/CD to handle collisions. Legacy</li>
<li><strong>Autonegotiation</strong> exchanges capabilities and picks the best common speed/duplex</li>
</ul>
<p><strong>Duplex mismatch</strong> — one side hard-coded full, the other auto-negotiating down to half. The link comes up and <em>works</em>, but throughput collapses under load: you see <strong>late collisions</strong> on the half-duplex side and <strong>FCS/CRC errors</strong> on the other. Fix: set both ends the same, or leave both on auto.</p>` },
      { t: 'Other L1 items worth a sentence', h: `<ul>
<li><strong>Straight-through vs crossover</strong> cable, and <strong>Auto-MDIX</strong> which makes it irrelevant on modern gear</li>
<li><strong>PoE</strong> — 802.3af 15.4 W / at 30 W / bt up to 90 W, for phones, APs and cameras</li>
<li><strong>Attenuation</strong> (signal loss over distance), <strong>EMI</strong>, and <strong>bend radius</strong> on fiber are the usual physical failure causes</li>
<li>Encoding: 1000BASE-T uses 4D-PAM5 across all four pairs. You will not be quizzed on this — know that "encoding turns bits into signals" and move on</li>
</ul>` }
    ]
  },
  {
    id: 'net-frame',
    icon: '🧱',
    layer: 'L2 Data Link',
    title: 'The Ethernet Frame — field by field',
    tagline: 'A topic he named explicitly. Be able to draw it from memory.',
    explain: `A frame is the envelope Ethernet puts around your data for <em>one hop across one local network</em>. This card is what's printed on that envelope: who it's for, who sent it, what kind of thing is inside, and a checksum proving it didn't get scrambled on the way.`,
    tags: ['frame', 'MAC', '802.1Q', 'EtherType'],
    blocks: [
      { t: 'The frame', h: `<pre class="net-pre">+----------+-----+---------+---------+----------+-----------+-------------+-----+
| Preamble | SFD |  Dest   | Source  | 802.1Q   | Type/Len  |   Payload   | FCS |
|  7 bytes | 1 B | MAC 6 B | MAC 6 B | (4 B opt)|   2 B     | 46-1500 B   | 4 B |
+----------+-----+---------+---------+----------+-----------+-------------+-----+
                 |&lt;--------------- frame: 64 to 1518 bytes ------------------&gt;|</pre>` },
      { t: 'Fields', h: `<table class="net-table"><thead><tr><th>Field</th><th>Size</th><th>Purpose</th></tr></thead><tbody>
<tr><td>Preamble</td><td>7 B</td><td>Alternating 1010… so the receiver's clock synchronizes</td></tr>
<tr><td>SFD<span class="net-expand">Start Frame Delimiter</span></td><td>1 B</td><td>10101011 — the last bit pair flips to say "frame starts now"</td></tr>
<tr><td>Destination MAC</td><td>6 B</td><td>Who it's for. Read first so a switch can forward before the frame finishes arriving</td></tr>
<tr><td>Source MAC</td><td>6 B</td><td>Who sent it. <strong>This is the field a switch learns from</strong></td></tr>
<tr><td>802.1Q tag</td><td>4 B</td><td>Optional. TPID (<em>Tag Protocol Identifier</em>) 0x8100, which is what marks the frame as tagged, + PCP (<em>Priority Code Point</em>, 3 bits of QoS priority) + DEI (<em>Drop Eligible Indicator</em>) + <strong>VLAN ID (12 bits)</strong> — the only field you really need to remember</td></tr>
<tr><td>EtherType / Length</td><td>2 B</td><td>≥ 0x0600 means EtherType (what's inside); below that means length (old 802.3)</td></tr>
<tr><td>Payload</td><td>46–1500 B</td><td>The L3 packet. Padded to 46 if shorter</td></tr>
<tr><td>FCS<span class="net-expand">Frame Check Sequence</span></td><td>4 B</td><td>A CRC32 checksum (<em>Cyclic Redundancy Check</em>) over the frame. Mismatch = the frame got corrupted in transit, so it is silently discarded and an error counter increments. Nothing asks for a retransmit at this layer — that is TCP's job, higher up</td></tr>
</tbody></table>
<p>Then a <strong>12-byte interframe gap</strong> before the next frame.</p>` },
      { t: 'EtherTypes to know', h: `<p><code>0x0800</code> IPv4 · <code>0x0806</code> ARP · <code>0x86DD</code> IPv6 · <code>0x8100</code> 802.1Q tagged · <code>0x8863/0x8864</code> PPPoE (<em>Point-to-Point Protocol over Ethernet</em>, used by some ISPs) · <code>0x88CC</code> LLDP</p>` },
      { t: 'Frame sizes', h: `<p>Minimum <strong>64 bytes</strong> (a leftover from collision-detection timing in half duplex), maximum <strong>1518</strong> (1522 with a VLAN tag).</p>
<ul>
<li>Undersized → <strong>runt</strong></li>
<li>Oversized → <strong>giant</strong></li>
<li>Oversized with a bad CRC → <strong>jabber</strong></li>
</ul>` },
      { t: 'MAC address structure', h: `<pre class="net-pre">00:1A:2B : 3C:4D:5E
|_______|  |_______|
   OUI      device
(vendor)   (serial)</pre>
<ul>
<li>48 bits, written as 6 hex octets. First 24 bits = <strong>OUI</strong>, assigned to the manufacturer by the IEEE — you can identify vendors from it</li>
<li>Bit 0 of the first octet = the <strong>I/G bit</strong> (<em>Individual / Group</em>). 0 = unicast (one specific device), 1 = multicast (a group of devices). That's why broadcast is <code>FF:FF:FF:FF:FF:FF</code> and multicast MACs start <code>01:00:5E</code></li>
<li>Bit 1 = the <strong>U/L bit</strong> (<em>Universal / Local</em>). 0 = globally unique, burned in at the factory; 1 = locally administered, meaning set by software — this is what you see on virtual machines and containers</li>
<li><strong>Flat address space, no hierarchy.</strong> That is exactly why MAC addresses can't be summarized, can't scale beyond a LAN, and why IP exists</li>
</ul>` }
    ]
  },
  {
    id: 'net-ipv4',
    icon: '📦',
    layer: 'L3 Network',
    title: 'The IPv4 Packet — field by field',
    tagline: 'The other format he named. 20 bytes minimum, up to 60 with options.',
    explain: `If the frame is the envelope for one hop, the IP packet is the envelope for the whole journey — it carries the real source and destination from end to end. One field, TTL, counts down at every router so a packet that gets lost in a loop eventually dies instead of circling forever.`,
    tags: ['IPv4', 'TTL', 'checksum', 'fragmentation'],
    blocks: [
      { t: 'The header', h: `<pre class="net-pre"> 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-------+-------+---------------+-------------------------------+
|Version|  IHL  |    DSCP/ECN   |         Total Length          |
+-------+-------+---------------+-----+-------------------------+
|         Identification        |Flags|     Fragment Offset     |
+---------------+---------------+-----+-------------------------+
|      TTL      |   Protocol    |        Header Checksum        |
+---------------+---------------+-------------------------------+
|                       Source IP Address                       |
+---------------------------------------------------------------+
|                     Destination IP Address                    |
+---------------------------------------------------------------+
|                    Options (if IHL &gt; 5)          |   Padding  |
+---------------------------------------------------------------+</pre>` },
      { t: 'Fields', h: `<table class="net-table"><thead><tr><th>Field</th><th>Size</th><th>What it does</th></tr></thead><tbody>
<tr><td>Version</td><td>4 bits</td><td>4 for IPv4, 6 for IPv6</td></tr>
<tr><td>IHL<span class="net-expand">Internet Header Length</span></td><td>4 bits</td><td>Header length, counted in 32-bit words. Normally 5, which means 20 bytes — it is only larger if optional fields are present</td></tr>
<tr><td>DSCP / ECN<span class="net-expand">Differentiated Services Code Point / Explicit Congestion Notification</span></td><td>8 bits</td><td>The traffic-priority marking (6 bits) — this is how voice gets treated better than a file download — plus 2 bits routers use to signal "I am getting congested" without dropping anything</td></tr>
<tr><td>Total Length</td><td>16 bits</td><td>Header + payload, so max packet is 65,535 bytes</td></tr>
<tr><td>Identification</td><td>16 bits</td><td>Groups fragments belonging to the same original packet</td></tr>
<tr><td>Flags</td><td>3 bits</td><td>Bit 1 = <strong>DF</strong> (Don't Fragment), bit 2 = <strong>MF</strong> (More Fragments)</td></tr>
<tr><td>Fragment Offset</td><td>13 bits</td><td>Where this fragment sits in the original, in 8-byte units</td></tr>
<tr><td><strong>TTL</strong><span class="net-expand">Time To Live</span></td><td>8 bits</td><td>Despite the name it is a <em>hop</em> count, not a timer. <strong>Decremented by every router. At 0 the packet is dropped and ICMP Time Exceeded is returned.</strong> Loop protection, and the mechanism traceroute exploits</td></tr>
<tr><td>Protocol</td><td>8 bits</td><td>What's in the payload: 1 ICMP, 6 TCP, 17 UDP, 47 GRE, 50 ESP, 89 OSPF</td></tr>
<tr><td>Header Checksum</td><td>16 bits</td><td>Covers the header only, not the data. <strong>Recomputed at every hop because TTL changed</strong></td></tr>
<tr><td>Source IP</td><td>32 bits</td><td>Stays the same end to end, unless NAT rewrites it</td></tr>
<tr><td>Destination IP</td><td>32 bits</td><td>Stays the same end to end</td></tr>
</tbody></table>` },
      { t: 'The three things interviewers dig at', h: `<ol>
<li><strong>TTL is why the header checksum has to be recalculated at every hop.</strong> Cause and effect — most candidates never connect them</li>
<li><strong>The checksum covers only the header.</strong> L4 has its own checksum for the data. IPv6 dropped the header checksum entirely and relies on the L2 FCS and L4 checksums</li>
<li><strong>Fragmentation is done by routers in IPv4, but reassembly only happens at the destination.</strong> IPv6 moved fragmentation to the source host only, which is why PMTUD matters more there</li>
</ol>` }
    ]
  },
  {
    id: 'net-switching',
    icon: '🔀',
    layer: 'L2 Data Link',
    title: 'How a Layer 2 Switch Learns and Forwards',
    tagline: 'Four verbs — learn, flood, forward, filter — plus aging. With a worked example to narrate out loud.',
    explain: `A switch starts out knowing nothing. It learns purely by eavesdropping: every frame that arrives tells it "whoever sent this is reachable out of this port." Once it has learned an address it sends frames to that one port instead of shouting to everybody — and that is the entire difference between a switch and the hub it replaced.`,
    tags: ['CAM table', 'flooding', 'aging'],
    blocks: [
      { t: 'The four verbs', h: `<p><strong>Learning</strong> — for every frame that arrives, the switch reads the <strong>source MAC</strong> and records <code>MAC → ingress port → VLAN</code> in its <strong>CAM table</strong> (<em>Content-Addressable Memory</em> — this is just the hardware name for what everyone calls the MAC address table). It <em>never</em> learns from the destination field.</p>
<p><strong>Forwarding decision</strong> — look up the <strong>destination MAC</strong>:</p>
<ul>
<li>Found in the table for this VLAN → send out that single port (<strong>forward</strong>)</li>
<li>Found, but the entry points to the same port it arrived on → <strong>filter</strong> (drop it, the destination is already on that segment)</li>
<li>Not found → <strong>flood</strong> out every other port in the same VLAN (unknown unicast flooding)</li>
<li>Destination is broadcast or multicast → flood within the VLAN</li>
</ul>
<p><strong>Aging</strong> — entries expire after <strong>300 seconds</strong> of silence, so moved devices don't get stale entries.</p>` },
      { t: 'Worked example — narrate this one out loud', h: `<p>Four hosts on one switch, VLAN 10, empty CAM table.</p>
<pre class="net-pre">A (aa:aa) -- Fa0/1     Switch     Fa0/3 -- C (cc:cc)
B (bb:bb) -- Fa0/2                Fa0/4 -- D (dd:dd)</pre>
<p><strong>Step 1 — A sends to C.</strong> Switch learns <code>aa:aa → Fa0/1</code>. Destination <code>cc:cc</code> is unknown, so it <strong>floods</strong> out Fa0/2, Fa0/3, Fa0/4. B and D receive it, examine the destination MAC, see it isn't theirs, and discard it in the NIC.</p>
<table class="net-table"><thead><tr><th>MAC</th><th>Port</th></tr></thead><tbody><tr><td>aa:aa</td><td>Fa0/1</td></tr></tbody></table>
<p><strong>Step 2 — C replies to A.</strong> Switch learns <code>cc:cc → Fa0/3</code>. Destination <code>aa:aa</code> is now known, so it <strong>forwards</strong> out Fa0/1 only. B and D see nothing.</p>
<table class="net-table"><thead><tr><th>MAC</th><th>Port</th></tr></thead><tbody><tr><td>aa:aa</td><td>Fa0/1</td></tr><tr><td>cc:cc</td><td>Fa0/3</td></tr></tbody></table>
<p><strong>Step 3 — A sends to C again.</strong> Both known. Unicast forward, no flooding. The conversation is now private to Fa0/1 and Fa0/3, which is the entire advantage of a switch over a hub.</p>
<p><strong>Step 4 — B sends a broadcast (an ARP request).</strong> Switch learns <code>bb:bb → Fa0/2</code>, then floods to Fa0/1, Fa0/3, Fa0/4 because broadcasts always flood inside the VLAN.</p>` },
      { t: 'Switching methods', h: `<ul>
<li><strong>Store-and-forward</strong> — read the whole frame, verify FCS, then forward. Catches corrupt frames. Default on modern switches</li>
<li><strong>Cut-through</strong> — forward as soon as the destination MAC is read (first 6 bytes after the preamble). Lowest latency, propagates bad frames. Used in HFT and some datacenter fabrics</li>
<li><strong>Fragment-free</strong> — reads the first 64 bytes, catching collision fragments. A compromise, mostly historical</li>
</ul>` },
      { t: 'Things that go wrong (good detail to volunteer)', h: `<ul>
<li><strong>CAM table overflow attack</strong> — flood the switch with random source MACs until the table fills, forcing it to flood everything, which lets the attacker sniff traffic. Mitigation: <strong>port security</strong> limiting MACs per port</li>
<li><strong>MAC flapping</strong> — the same MAC appears on two ports alternately; the log message says exactly that. Almost always a physical loop with STP disabled, or a misconfigured NIC team</li>
<li><strong>Unknown unicast flooding at scale</strong> — asymmetric routing, or an ARP timeout longer than the MAC aging timer, makes the switch flood real traffic continuously</li>
</ul>` }
    ]
  },
  {
    id: 'net-stp',
    icon: '🌳',
    layer: 'L2 Data Link',
    title: 'Spanning Tree Protocol',
    tagline: 'He named STP as the example of "L2 control protocols." Expect it.',
    explain: `Two switches joined by two cables is a loop, and a loop on Ethernet is fatal — one broadcast circles forever and multiplies at every switch until the network is dead. STP's job is to spot the loop and deliberately switch one link off, holding it in reserve until the main one fails.`,
    tags: ['STP', 'RSTP', 'BPDU', 'broadcast storm'],
    blocks: [
      { t: 'Why it exists', h: `<p>Ethernet frames have <strong>no TTL field</strong>. Put two switches together with two cables and one broadcast frame circulates forever, gets duplicated at every switch, and multiplies exponentially. Within seconds the links saturate, CPUs peg, and MAC tables thrash because the same source MAC keeps arriving on different ports. That's a <strong>broadcast storm</strong>, and it takes down the entire L2 domain, not just the looped link.</p>
<p>You still want the second cable for redundancy. STP (802.1D) lets you have it by putting the redundant path in a blocking state and activating it only when the primary fails.</p>` },
      { t: 'How the tree gets built', h: `<p><strong>1. Elect the root bridge.</strong> Every switch sends <strong>BPDUs</strong> — <em>Bridge Protocol Data Units</em>, small messages that say "here is my ID and my cost to reach the root" — to the reserved multicast address <code>01:80:C2:00:00:00</code>, every 2 seconds, each one initially claiming to be the root itself. Lowest <strong>Bridge ID</strong> wins.</p>
<pre class="net-pre">Bridge ID = [ Priority 4 bits ][ Extended System ID 12 bits ][ MAC 48 bits ]
              default 32768        = VLAN number             switch's own</pre>
<p>Priority is configured in increments of 4096. If priorities tie, the <strong>lowest MAC address</strong> wins — which means <strong>the oldest switch in the building becomes root by default</strong>. That's usually your slowest access switch sitting under someone's desk. Always set the root manually to your core:</p>
<pre class="net-pre">spanning-tree vlan 10 root primary      (sets priority 24576)
spanning-tree vlan 10 priority 4096</pre>
<p><strong>2. Each non-root switch picks one Root Port</strong> — the port with the lowest <strong>cumulative path cost</strong> back to the root.</p>
<table class="net-table"><thead><tr><th>Link speed</th><th>Cost (802.1D)</th><th>Cost (long / RSTP)</th></tr></thead><tbody>
<tr><td>10 Mbps</td><td>100</td><td>2,000,000</td></tr>
<tr><td>100 Mbps</td><td>19</td><td>200,000</td></tr>
<tr><td>1 Gbps</td><td>4</td><td>20,000</td></tr>
<tr><td>10 Gbps</td><td>2</td><td>2,000</td></tr>
</tbody></table>
<p>Costs add up along the path. Tiebreakers in order: lowest sender bridge ID, then lowest sender port ID, then lowest local port ID.</p>
<p><strong>3. Each segment picks one Designated Port</strong> — the port on that segment with the lowest cost to root. Every port on the root bridge is designated.</p>
<p><strong>4. Everything else blocks.</strong> A blocking port still listens to BPDUs; it just doesn't forward or learn.</p>` },
      { t: 'Port states (802.1D)', h: `<table class="net-table"><thead><tr><th>State</th><th>Forwards data</th><th>Learns MACs</th><th>Processes BPDUs</th><th>Timer</th></tr></thead><tbody>
<tr><td>Blocking</td><td>No</td><td>No</td><td>Yes</td><td>20 s max age</td></tr>
<tr><td>Listening</td><td>No</td><td>No</td><td>Yes</td><td>15 s forward delay</td></tr>
<tr><td>Learning</td><td>No</td><td><strong>Yes</strong></td><td>Yes</td><td>15 s forward delay</td></tr>
<tr><td>Forwarding</td><td>Yes</td><td>Yes</td><td>Yes</td><td>—</td></tr>
<tr><td>Disabled</td><td>No</td><td>No</td><td>No</td><td>—</td></tr>
</tbody></table>
<p><strong>Timers</strong>: hello 2 s, forward delay 15 s, max age 20 s. Converging from blocking to forwarding takes <strong>30 to 50 seconds</strong>. That is unacceptably slow for a modern network, and it's the entire reason for RSTP.</p>` },
      { t: 'RSTP (802.1w) — the version actually running', h: `<ul>
<li>Converges in <strong>under a second</strong> on point-to-point links</li>
<li>Port roles: Root, Designated, <strong>Alternate</strong> (a pre-computed backup path to root), <strong>Backup</strong> (redundant link to the same segment)</li>
<li>Port states collapse to three: <strong>Discarding, Learning, Forwarding</strong></li>
<li>Uses proposal/agreement handshakes between switches instead of waiting out timers</li>
<li>Every switch originates BPDUs rather than only relaying root BPDUs, so failure detection is fast (3 missed hellos)</li>
<li><strong>MST</strong> (<em>Multiple Spanning Tree</em>, 802.1s) maps many VLANs onto a few spanning-tree instances, because running a separate one per VLAN doesn't scale past a few hundred. <strong>PVST+</strong> (<em>Per-VLAN Spanning Tree Plus</em>) and Rapid-PVST+ are Cisco's per-VLAN versions</li>
</ul>` },
      { t: 'Protection features', h: `<pre class="net-pre">spanning-tree portfast          # access ports skip listening/learning, go straight to forwarding
spanning-tree bpduguard enable  # if a BPDU arrives on a PortFast port, err-disable it
spanning-tree guard root        # refuse to accept a superior BPDU on this port
spanning-tree loopguard         # if BPDUs stop arriving on a blocking port, keep it blocked</pre>
<p>PortFast exists because a server that boots in 8 seconds shouldn't wait 30 for its port. PortFast on a port that leads to another switch <em>creates</em> a loop, which is exactly why you pair it with BPDU Guard. Root Guard stops a rogue switch in a conference room from becoming root and pulling all traffic through a 100 Mbps link.</p>` },
      { t: 'Topology change', h: `<p>When a link fails, the switch sends a <strong>TCN</strong> (<em>Topology Change Notification</em>) BPDU toward the root. The root sets the topology-change flag, and every switch temporarily reduces its MAC aging timer from 300 seconds to the forward delay (15 s) so stale entries clear quickly. That's why you see a brief burst of flooding after any topology change.</p>` }
    ]
  },
  {
    id: 'net-l2-control',
    icon: '🚦',
    layer: 'L2 Data Link',
    title: 'Layer 2 Control & Protection Protocols',
    tagline: 'STP is the famous one. Here is the rest of the family, and what each one is protecting you from.',
    explain: `A switch on its own can't tell that someone plugged both ends of a cable into it, that a fiber broke in one direction, or that the laptop on port 12 is pretending to be the DHCP server. Every protocol on this card bolts one of those safety checks onto the switch.`,
    tags: ['LLDP', 'DTP', 'VTP', 'UDLD', 'port security'],
    blocks: [
      { t: 'Why Layer 2 needs a "control plane" at all', h: `<p>A switch by itself is dumb in a very specific way: it forwards frames and that's it. It has no way to notice that someone plugged both ends of a cable into the same switch, that a fiber is broken in one direction, or that the laptop on port 12 is pretending to be the DHCP server. Every protocol on this card exists to bolt one of those checks onto the switch.</p>
<p>If it helps, the software analogy is exact: the <strong>data plane</strong> is your request handler — it just serves traffic as fast as it can. The <strong>control plane</strong> is service discovery, health checks and config distribution — the background conversations that decide <em>what the data plane is allowed to do</em>.</p>` },
      { t: 'Discovery — LLDP and CDP: "what is on the other end of this cable?"', h: `<ul>
<li><strong>LLDP</strong> — <em>Link Layer Discovery Protocol</em>, the IEEE open standard (802.1AB). Every switch periodically announces itself out of every port: "I am switch <code>core-sw-01</code>, this is port <code>Gi1/0/12</code>, here's my model and my management IP." Neighbors record what they hear. That's how a network diagram gets built without anyone walking to the rack</li>
<li><strong>CDP</strong> — <em>Cisco Discovery Protocol</em>. Same idea, older, Cisco-only. In a mixed-vendor network you use LLDP</li>
<li><strong>LLDP-MED</strong> — <em>Media Endpoint Discovery</em>, the extension for phones and cameras. It's how an IP phone is told which VLAN to put voice traffic on and how much Power over Ethernet it's allowed to draw, without anyone configuring the phone</li>
</ul>
<p>Why you'd reach for it: <code>show lldp neighbors</code> answers "what's plugged into this port" in one command. Without it, that question means a flashlight and a trip to the data center.</p>` },
      { t: 'Trunk negotiation — DTP, and why the answer is "turn it off"', h: `<p><strong>DTP</strong> — <em>Dynamic Trunking Protocol</em>, Cisco. Two switch ports talk to each other and negotiate what the link should become: an <strong>access port</strong> (carries one VLAN, faces a PC) or a <strong>trunk</strong> (carries many VLANs, faces another switch).</p>
<p>Convenient, and a security hole. A laptop running software that speaks DTP can talk a switch port into becoming a trunk — and a trunk carries <em>every</em> VLAN. The attacker now sees traffic from the server VLAN, the management VLAN, everything. That attack is called <strong>VLAN hopping</strong>.</p>
<p>So the best-practice answer is: decide what the port is yourself and refuse to negotiate.</p>
<pre class="net-pre">switchport mode access        # this port is an access port, permanently
switchport nonegotiate        # and stop sending DTP frames</pre>` },
      { t: 'VLAN database sync — VTP, and the story everyone tells about it', h: `<p><strong>VTP</strong> — <em>VLAN Trunking Protocol</em>, Cisco. The idea is reasonable: designate one switch as the server, create VLAN 30 there once, and it propagates to all the others automatically instead of you typing it on forty switches.</p>
<p>The failure mode is what makes it famous. Each copy of the VLAN database carries a <strong>revision number</strong>, and higher always wins — with no check on whether the sender is important. Plug an old lab switch into the network, one that happens to carry a higher revision number and an <em>empty</em> VLAN list, and it will confidently overwrite every switch in the domain. Every VLAN in the building disappears at once.</p>
<p>Best practice: run <strong>VTP transparent mode</strong> (each switch keeps its own VLAN list and just passes messages through), or VTPv3, which requires one explicitly designated primary server before anything can be overwritten.</p>` },
      { t: 'Broken-in-one-direction links — UDLD', h: `<p><strong>UDLD</strong> — <em>UniDirectional Link Detection</em>, Cisco (the standards-based equivalent is 802.3ah link OAM, <em>Operations, Administration and Maintenance</em>).</p>
<p>Fiber is two strands, one for each direction. If one strand breaks or one transceiver goes bad, the link still reports <strong>up</strong> — but traffic only flows one way.</p>
<p>Here's why that is worse than a clean failure. STP works by <em>hearing</em> BPDUs (<em>Bridge Protocol Data Units</em> — the little "I am the root, here's my cost" messages switches exchange). A port that STP put in blocking state keeps listening. If BPDUs stop arriving because the receive strand died, that port concludes "nobody is out there anymore, the redundant path must be gone" and promotes itself to forwarding — and now you have exactly the loop STP existed to prevent, with traffic still flowing the other direction.</p>
<p>Two defenses, from opposite ends:</p>
<ul>
<li><strong>UDLD</strong> sends a hello containing its own identity and expects the neighbor to echo it back. No echo means the link is one-way, so it shuts the port down</li>
<li><strong>Loop Guard</strong> attacks it from the STP side: if BPDUs stop arriving on a port that was blocking, keep it blocked rather than promoting it. "Silence is not permission"</li>
</ul>` },
      { t: 'Access-edge protection — stopping an untrusted port from lying', h: `<p>Everything above assumes the other end of the cable is a switch you own. These features assume the opposite — that the thing on port 12 might be hostile or just misconfigured.</p>
<table class="net-table"><thead><tr><th>Feature</th><th>Full name</th><th>What it stops</th></tr></thead><tbody>
<tr><td><strong>Port security</strong></td><td>—</td><td>Limits how many MAC addresses a port may learn. Stops <strong>CAM table overflow</strong>: an attacker floods thousands of fake source MACs until the switch's address table is full, at which point it can't look anything up and floods every frame out every port — so the attacker sees traffic that was never meant for them</td></tr>
<tr><td><strong>BPDU Guard</strong></td><td>Bridge Protocol Data Unit Guard</td><td>Shuts down a port if a <em>switch</em> shows up on it. A port configured for a PC should never receive a BPDU; if it does, someone plugged a desk switch in and is about to change your spanning tree</td></tr>
<tr><td><strong>Root Guard</strong></td><td>—</td><td>Refuses to accept a "better" BPDU on this port. Stops a switch in a conference room from winning the root-bridge election and pulling the whole network's traffic through a 100 Mbps link</td></tr>
<tr><td><strong>Loop Guard</strong></td><td>—</td><td>Keeps a blocking port blocked when BPDUs go silent — the one-way-link problem above</td></tr>
<tr><td><strong>DHCP snooping</strong></td><td>Dynamic Host Configuration Protocol snooping</td><td>Only ports you mark as trusted (your uplinks) are allowed to send DHCP <em>offers</em>. Stops a rogue DHCP server — usually someone's home router plugged in backwards — from handing out wrong IP addresses and pointing users at the wrong gateway. As a side effect it builds a <strong>binding table</strong> of IP ↔ MAC ↔ port ↔ VLAN, which the next two features depend on</td></tr>
<tr><td><strong>DAI</strong></td><td>Dynamic ARP Inspection</td><td>Checks every ARP reply against that binding table and drops the ones that lie. Stops <strong>ARP spoofing</strong>, where an attacker claims to be the gateway and becomes a man in the middle</td></tr>
<tr><td><strong>IP Source Guard</strong></td><td>—</td><td>Drops frames whose source IP doesn't match the binding for that port. Stops IP address spoofing</td></tr>
<tr><td><strong>Storm control</strong></td><td>—</td><td>Rate-limits broadcast, multicast and unknown-unicast on a port, so one broken NIC or one looped desk hub can't saturate the whole VLAN</td></tr>
<tr><td><strong>802.1X</strong></td><td>IEEE 802.1X port-based Network Access Control</td><td>The port carries no traffic until the device authenticates against a <strong>RADIUS</strong> server (<em>Remote Authentication Dial-In User Service</em> — the standard "check this login for me" protocol). Physical access to a wall jack stops being the same thing as network access</td></tr>
</tbody></table>` },
      { t: 'The one-sentence version — say this if they ask "what else besides STP?"', h: `<p><em>"STP keeps the topology loop-free, LACP bundles several physical links into one logical one, LLDP tells you what's plugged in where — and then there's a family of protection features at the access edge, things like port security, BPDU guard, DHCP snooping and dynamic ARP inspection, whose whole job is to stop an untrusted port from lying to the network."</em></p>
<p>Then stop. If they want one of those expanded, they'll ask — and each row of the table above is a complete answer on its own.</p>` }
    ]
  },
  {
    id: 'net-router-forwarding',
    icon: '🧭',
    layer: 'L3 Network',
    title: 'How a Router Forwards an IP Packet',
    tagline: 'Seven steps — and the MAC rewrite is the point of the whole answer.',
    explain: `A router's job at each hop: check the packet is still alive, look up where the destination lives, put a <em>fresh</em> local envelope on it addressed to the next router, and send it on. The outer envelope is replaced at every hop; the packet inside is never touched. Say that sentence and you've shown you understand layer 2 versus layer 3.`,
    tags: ['forwarding', 'longest prefix match', 'TTL', 'ARP'],
    blocks: [
      { t: 'The seven steps', h: `<ol>
<li><strong>Receive the frame.</strong> Check the destination MAC — if it isn't the router's own interface MAC (or a broadcast/multicast it cares about), discard. Verify the FCS</li>
<li><strong>De-encapsulate.</strong> Strip the Ethernet header and trailer. Read the EtherType, see <code>0x0800</code>, hand the payload to the IP process</li>
<li><strong>Validate.</strong> Verify the IP header checksum. Check the TTL. <strong>If TTL is 1 or 0, drop the packet and send back ICMP Type 11 Time Exceeded</strong> — that's what makes traceroute work</li>
<li><strong>Look up the destination.</strong> Compare the destination IP against every entry in the routing table (the FIB in hardware) and select the <strong>longest prefix match</strong>. Most specific wins, regardless of protocol or metric. Ties are broken by administrative distance, then metric. No match and no default route → drop, send ICMP Type 3 Destination Unreachable</li>
<li><strong>Decrement TTL and recompute the header checksum.</strong> These two go together — TTL changed, so the old checksum is invalid</li>
<li><strong>Resolve the next hop's MAC.</strong> The routing table gives an exit interface and a next-hop IP. The router checks its ARP cache for that next-hop IP; if it's missing, it sends an ARP request and queues the packet</li>
<li><strong>Re-encapsulate and transmit.</strong> Build a new Ethernet header: <strong>source MAC = the router's outgoing interface, destination MAC = the next hop's MAC</strong>. Recompute the FCS. Send</li>
</ol>` },
      { t: 'The end-to-end walk — memorize this table', h: `<p>This is the single best answer for demonstrating you understand L2 vs L3, and it's the most likely question in the set he described.</p>
<p><strong>PC-A (10.1.1.10) sends to Server-B (10.3.3.20), through two routers.</strong></p>
<pre class="net-pre">PC-A ---- [R1] ---- [R2] ---- Server-B
10.1.1.10  .1  .1        .2   10.3.3.20
           MAC:R1a  R1b  R2a  R2b</pre>
<table class="net-table"><thead><tr><th>Hop</th><th>Src MAC</th><th>Dst MAC</th><th>Src IP</th><th>Dst IP</th><th>TTL</th></tr></thead><tbody>
<tr><td>PC-A → R1</td><td>PC-A</td><td><strong>R1a</strong></td><td>10.1.1.10</td><td>10.3.3.20</td><td>64</td></tr>
<tr><td>R1 → R2</td><td><strong>R1b</strong></td><td><strong>R2a</strong></td><td>10.1.1.10</td><td>10.3.3.20</td><td>63</td></tr>
<tr><td>R2 → Server</td><td><strong>R2b</strong></td><td><strong>Server-B</strong></td><td>10.1.1.10</td><td>10.3.3.20</td><td>62</td></tr>
</tbody></table>
<p>Say this out loud: <strong>the MAC addresses change at every hop, the IP addresses never change, and the TTL drops by one each time.</strong> That sentence is the whole of L2 versus L3 in one line.</p>
<p><em>Follow-up they may ask:</em> how did PC-A know to send the frame to R1's MAC when the packet is addressed to 10.3.3.20? PC-A ANDs the destination with its own subnet mask, sees the result differs from its own network, concludes the destination is remote, and therefore ARPs for its <strong>default gateway</strong> instead. The frame goes to the gateway's MAC while the packet keeps the server's IP.</p>` },
      { t: 'Routing table anatomy', h: `<pre class="net-pre">      Codes: C - connected, S - static, O - OSPF, D - EIGRP, B - BGP

O     10.3.3.0/24 [110/20] via 172.16.1.2, 00:14:22, GigabitEthernet0/1
      |            |    |       |              |            |
      |            |    |       next hop       uptime       exit interface
      |            |    metric
      |            administrative distance
      prefix learned via OSPF</pre>` },
      { t: 'Longest prefix match, concretely', h: `<p>Destination 10.1.1.50, with these routes in the table:</p>
<table class="net-table"><thead><tr><th>Route</th><th>Matches?</th><th>Prefix length</th></tr></thead><tbody>
<tr><td>0.0.0.0/0</td><td>yes</td><td>0</td></tr>
<tr><td>10.0.0.0/8</td><td>yes</td><td>8</td></tr>
<tr><td>10.1.0.0/16</td><td>yes</td><td>16</td></tr>
<tr><td><strong>10.1.1.0/24</strong></td><td><strong>yes</strong></td><td><strong>24 ← wins</strong></td></tr>
<tr><td>10.1.2.0/24</td><td>no</td><td>—</td></tr>
</tbody></table>
<p>The /24 wins even if it was learned by RIP (AD 120) and the /8 came from a static route (AD 1). <strong>Specificity beats trust.</strong> AD is only consulted when two sources offer the <em>same</em> prefix.</p>` },
      { t: 'ICMP — the protocol routers use to tell you why something failed', h: `<p><strong>ICMP</strong> — <em>Internet Control Message Protocol</em>, IP protocol number 1. It carries no user data. It exists so a router or host can send back an error or a diagnostic: "I couldn't deliver this, and here's why." Almost every troubleshooting tool you'll use is really just ICMP with a nice wrapper.</p>
<table class="net-table"><thead><tr><th>Type</th><th>Name</th><th>When you see it</th></tr></thead><tbody>
<tr><td><strong>8 / 0</strong></td><td>Echo Request / Echo Reply</td><td>This pair <em>is</em> ping. Type 8 goes out, type 0 comes back. Nothing more to it</td></tr>
<tr><td><strong>3</strong></td><td>Destination Unreachable</td><td>The router had nowhere to send it. The <em>code</em> says which flavor: 0 network unreachable, 1 host unreachable, 3 port unreachable (nothing listening on that UDP port), and <strong>4 = fragmentation needed but the Don't Fragment bit was set</strong></td></tr>
<tr><td><strong>5</strong></td><td>Redirect</td><td>"There's a better gateway on this subnet — send it to that one instead"</td></tr>
<tr><td><strong>11</strong></td><td>Time Exceeded</td><td>TTL hit zero and the packet was dropped. This is the one that makes traceroute possible</td></tr>
</tbody></table>` },
      { t: 'How traceroute actually works (a nice thing to be able to explain)', h: `<p>It's a trick built entirely on TTL and ICMP Time Exceeded:</p>
<ol>
<li>Send a packet toward the destination with <strong>TTL = 1</strong>. The first router decrements it to 0, drops it, and returns ICMP Time Exceeded — <em>and that reply reveals the first router's IP address</em></li>
<li>Send another with <strong>TTL = 2</strong>. It survives the first router, dies at the second, which identifies itself the same way</li>
<li>Keep incrementing. Each round reveals one more hop, in order</li>
<li>When the packet finally reaches the destination, the answer is different — a port-unreachable or an echo reply rather than a time-exceeded — which is how traceroute knows to stop counting</li>
</ol>
<p>Two consequences worth knowing, because they're the source of most misread traceroutes:</p>
<ul>
<li>A router that is configured not to reply to ICMP just shows as <code>* * *</code>. That means "this hop declined to answer the probe", <strong>not</strong> "traffic stopped here" — packets are still passing through fine</li>
<li>Firewalls that block ICMP entirely also block <strong>Type 3 Code 4</strong>, which is what Path MTU Discovery depends on. That's the cause of the classic "small requests work, large ones hang" symptom</li>
</ul>` },
      { t: 'Control plane vs data plane', h: `<p>Worth one sentence, and it impresses. Two acronyms first, because they're both just "the routing table" seen from different angles:</p>
<ul>
<li><strong>RIB</strong> — <em>Routing Information Base</em>. The full routing table as the protocols built it, living in software. This is what <code>show ip route</code> prints</li>
<li><strong>FIB</strong> — <em>Forwarding Information Base</em>. A stripped-down copy of the winning routes, pushed into dedicated hardware so lookups happen at wire speed. Cisco's implementation is called <strong>CEF</strong> (<em>Cisco Express Forwarding</em>)</li>
</ul>
<p>So: the <strong>control plane</strong> runs the protocols and builds the RIB; the <strong>data plane</strong> forwards actual packets using the FIB. That separation is why a router can push millions of packets per second while OSPF is busy recalculating in the background — the recalculation happens off to the side and only the result gets pushed down.</p>
<p>The software analogy: the control plane is your config/service-discovery layer, the data plane is the hot path. You don't want the hot path blocking on a config reload.</p>` }
    ]
  },
  {
    id: 'net-routing-protocols',
    icon: '🗺️',
    layer: 'L3 Network',
    title: 'Routing Concepts and Protocols',
    tagline: 'Distance vector vs link state vs path vector — and the OSPF detail that actually gets asked.',
    explain: `Routers need to learn where every network in the company lives without a human typing it in. The protocol families differ in <em>what they tell each other</em>: "here's my whole list of destinations, trust me" (distance vector) versus "here's what I'm directly plugged into, work out the map yourself" (link state).`,
    tags: ['OSPF', 'BGP', 'RIP', 'EIGRP', 'AD'],
    blocks: [
      { t: 'The three families', h: `<table class="net-table"><thead><tr><th>Family</th><th>How it works</th><th>Knows</th><th>Examples</th><th>Convergence</th></tr></thead><tbody>
<tr><td><strong>Distance vector</strong></td><td>Tells neighbors its whole table, periodically — "routing by rumor"</td><td>Direction + distance only</td><td>RIP (EIGRP is advanced DV)</td><td>Slow</td></tr>
<tr><td><strong>Link state</strong></td><td>Floods link status to everyone; each router builds the full map and computes its own tree</td><td>Complete topology</td><td>OSPF, IS-IS</td><td>Fast</td></tr>
<tr><td><strong>Path vector</strong></td><td>Advertises the full AS path, applies policy</td><td>Path + attributes</td><td>BGP</td><td>Slow, deliberately</td></tr>
</tbody></table>
<p><strong>IGP</strong> — inside one administrative domain: RIP, OSPF, EIGRP, IS-IS. Goal is finding the fastest path. <strong>EGP</strong> — between domains: BGP. Goal is enforcing business policy, not speed.</p>` },
      { t: 'Administrative distance', h: `<table class="net-table"><thead><tr><th>Source</th><th>AD</th></tr></thead><tbody>
<tr><td>Connected</td><td>0</td></tr>
<tr><td>Static</td><td>1</td></tr>
<tr><td>eBGP</td><td>20</td></tr>
<tr><td>EIGRP (internal)</td><td>90</td></tr>
<tr><td>OSPF</td><td>110</td></tr>
<tr><td>RIP</td><td>120</td></tr>
<tr><td>EIGRP (external)</td><td>170</td></tr>
<tr><td>iBGP</td><td>200</td></tr>
<tr><td>Unreachable</td><td>255</td></tr>
</tbody></table>
<p>Lookup order overall: <strong>longest prefix match → administrative distance → metric → ECMP load balance</strong>.</p>` },
      { t: "RIP (know it, don't use it)", h: `<p>Hop-count metric, max 15 hops (16 = unreachable), 30-second updates, AD 120. Loop prevention via split horizon, route poisoning and hold-down timers. Its only real value in an interview is as the contrast to OSPF: it picks a 15-hop gigabit path over a 2-hop path because it can't see bandwidth.</p>` },
      { t: 'OSPF (the one to actually know)', h: `<ul>
<li>Link-state, open standard, AD <strong>110</strong>, IP protocol number 89, metric is <strong>cost = reference bandwidth / interface bandwidth</strong> (default reference 100 Mbps, so anything above 100 Mbps ties at cost 1 unless you raise the reference)</li>
<li>Every router floods <strong>LSAs</strong> (<em>Link State Advertisements</em> — "here is what I am directly connected to") out to every other router. All routers in an area therefore end up holding an identical <strong>LSDB</strong> (<em>Link State Database</em>), which is a complete map of the topology. Each then runs <strong>Dijkstra's SPF</strong> algorithm (<em>Shortest Path First</em>) over that map to work out its own best path to everywhere. Same Dijkstra you'd recognise from a graph problem</li>
<li><strong>Areas</strong> limit how far LSAs flood and how much has to be recalculated when something changes — without them, one flapping link in the basement would make every router in the company recompute. <strong>Area 0 is the backbone</strong>, and every other area must touch it through an <strong>ABR</strong> (<em>Area Border Router</em>, a router with a foot in both). An <strong>ASBR</strong> (<em>Autonomous System Boundary Router</em>) is the one that injects routes learned from outside OSPF entirely</li>
<li>Neighbor states: Down → Init → <strong>2-Way</strong> → ExStart → Exchange → Loading → <strong>Full</strong></li>
<li>On a shared segment with several routers it elects a <strong>DR</strong> and <strong>BDR</strong> (<em>Designated Router</em> and <em>Backup Designated Router</em>). Everyone then talks to the DR instead of every router pairing up with every other — the same n² blow-up you'd avoid with a message broker instead of point-to-point connections. Highest OSPF priority wins, then highest router ID</li>
<li><strong>Adjacency requires matching</strong>: area ID, hello and dead timers, subnet and mask, authentication, MTU, and stub flags. Mismatched MTU sticks the neighbor in <strong>EXSTART</strong>; mismatched timers or subnet means the neighbor never appears at all. These two are the most common real OSPF faults</li>
<li>Hello 10 s / dead 40 s on broadcast links</li>
</ul>` },
      { t: 'EIGRP and BGP', h: `<p><strong>EIGRP</strong> — Cisco's, now published. Advanced distance vector, AD 90 internal, metric from bandwidth and delay. Uses <strong>DUAL</strong> (<em>Diffusing Update Algorithm</em>) with a <strong>feasible successor</strong> — a backup route that has already been proven loop-free ahead of time, so failover is sub-second with no recalculation needed. Mention it only if the shop is Cisco.</p>
<p><strong>BGP</strong> — path vector, runs over <strong>TCP port 179</strong>, AD 20 external / 200 internal. Carries the full internet table (~950,000 routes). eBGP runs between different AS, iBGP within one AS (and iBGP needs a full mesh or route reflectors). Selects on business policy rather than speed: weight → local preference → locally originated → shortest <strong>AS_PATH</strong> (the list of networks the route crossed to get here) → origin → <strong>MED</strong> (<em>Multi-Exit Discriminator</em>, a hint to a neighbour about which of your links to prefer) → eBGP over iBGP → lowest IGP metric to the next hop. You use it when you have two ISPs or you're peering. In this interview, one paragraph is enough.</p>` },
      { t: 'Static routes and defaults', h: `<pre class="net-pre">ip route 0.0.0.0 0.0.0.0 203.0.113.1          # default: send anything unknown here
ip route 10.5.0.0 255.255.0.0 172.16.1.2      # specific
ip route 10.5.0.0 255.255.0.0 172.16.9.2 200  # floating static, AD 200, backup only</pre>
<p>Static is predictable, has zero protocol overhead, and doesn't react to failure. Use it at stub sites, for default routes, and as a floating backup behind a dynamic protocol.</p>` },
      { t: 'Concepts that get asked', h: `<ul>
<li><strong>Convergence</strong> — how long until every router agrees on the new topology after a change. The metric that matters for any protocol comparison</li>
<li><strong>Split horizon</strong> — never advertise a route back out the interface you learned it on. Basic DV loop prevention</li>
<li><strong>Route summarization / aggregation</strong> — advertise 10.1.0.0/16 instead of 256 separate /24s. Shrinks tables and hides flapping links from the rest of the network. Requires contiguous, well-planned addressing, which is the practical reason subnet design matters</li>
<li><strong>ECMP</strong> — equal-cost multipath. Multiple paths with the same metric, hashed per flow so one TCP session stays on one path and doesn't reorder</li>
<li><strong>Redistribution</strong> — importing routes from one protocol into another. Dangerous; causes routing loops if done in two places without filtering</li>
<li><strong>FHRP</strong> — HSRP/VRRP/GLBP give hosts one virtual gateway IP shared by two routers, so gateway failure doesn't strand the subnet. VRRP is the open standard, HSRP is Cisco</li>
<li><strong>Passive interface</strong> — the router advertises a subnet but sends no hellos on it. Standard on user-facing VLANs so nobody can form an adjacency with you</li>
</ul>` },
      { t: 'Router vs L3 switch', h: `<p>Both route. The <strong>L3 switch</strong> does it in hardware ASICs at line rate, has high Ethernet port density, and handles inter-VLAN routing inside a campus. The <strong>router</strong> forwards in software (or on an NPU), has fewer ports but supports WAN interface types, and carries the heavier feature set: NAT, VPN termination, deep QoS, complex ACLs, full BGP tables. Answer: <em>"same L3 function, different port density, interface types, and feature depth."</em></p>` }
    ]
  },
  {
    id: 'net-vlans',
    icon: '🏷️',
    layer: 'L2 Data Link',
    title: 'VLANs and Inter-VLAN Routing',
    tagline: 'Access vs trunk, 802.1Q tagging, native-VLAN mismatch, SVIs.',
    explain: `One physical switch, but the finance PCs and the factory machines must not be able to see each other. A VLAN is that dividing line drawn in software — same hardware, separate networks, and traffic can only cross between them by going through a router.`,
    tags: ['VLAN', '802.1Q', 'trunk', 'SVI'],
    blocks: [
      { t: 'What a VLAN is', h: `<p>A VLAN is a logically separate L2 broadcast domain running on shared physical switches. VLAN 1 is the default — don't use it for user traffic.</p>
<ul>
<li><strong>Access port</strong> — carries exactly one VLAN, untagged, faces an end device (PC, printer, server NIC)</li>
<li><strong>Trunk port</strong> — carries multiple VLANs between switches, tagged with <strong>802.1Q</strong> (a 4-byte tag inserted after the source MAC, holding a 12-bit VLAN ID → 4094 usable VLANs)</li>
<li><strong>Native VLAN</strong> — the one VLAN sent untagged on a trunk. Must match on both ends or you get VLAN hopping and odd cross-talk. Mismatch is a top-5 real-world switching bug</li>
<li><strong>Voice VLAN</strong> — the phone tags voice and passes PC traffic untagged on the same port</li>
</ul>` },
      { t: 'Inter-VLAN routing', h: `<p>Needs an L3 device:</p>
<ul>
<li><strong>Router on a stick</strong> — one physical link, subinterfaces per VLAN (<code>interface g0/0.10</code>, <code>encapsulation dot1Q 10</code>). Fine for small sites, bottlenecked by the single link</li>
<li><strong>L3 switch with SVIs</strong> — <code>interface vlan 10</code> with an IP. How real networks do it; routing happens in ASIC at line rate</li>
</ul>
<p><strong>SVI</strong> = Switched Virtual Interface = the VLAN interface that acts as the gateway for that subnet.</p>` },
      { t: 'MAC table vs ARP table', h: `<table class="net-table"><thead><tr><th></th><th>MAC / CAM table</th><th>ARP table</th></tr></thead><tbody>
<tr><td>Lives on</td><td>Switch</td><td>Any IP host, including routers</td></tr>
<tr><td>Maps</td><td>MAC → port</td><td>IP → MAC</td></tr>
<tr><td>Layer</td><td>2</td><td>3 to 2</td></tr>
<tr><td>Built by</td><td>Reading source MACs</td><td>ARP request / reply</td></tr>
</tbody></table>
<p>A switch consults its MAC table to decide which port to send a frame out of. A host consults its ARP table to decide what to write in the destination MAC field in the first place.</p>` },
      { t: 'Collision vs broadcast domains', h: `<ul>
<li><strong>Switch</strong> — every port is its own collision domain; all ports share one broadcast domain <strong>per VLAN</strong></li>
<li><strong>Router / L3 boundary</strong> — separates broadcast domains. A switch alone does not</li>
<li><strong>Hub</strong> — one collision domain, one broadcast domain. Know the concept; they're gone from production</li>
</ul>
<p>With full duplex, collisions don't happen at all — which is why "collision domain" is now mostly a vocabulary question.</p>` }
    ]
  },
  {
    id: 'net-lag',
    icon: '🔗',
    layer: 'L2 Data Link',
    title: 'Link Aggregation',
    tagline: 'Four 1G links do not give one transfer 4G. Interviewers like this one.',
    explain: `Bond several cables between two switches so they behave as one fat link, for bandwidth and for redundancy. The catch worth volunteering: one conversation still only rides one cable, so four 1-gig links do not make a single file transfer four times faster.`,
    tags: ['LACP', '802.3ad', 'EtherChannel'],
    blocks: [
      { t: 'The protocols', h: `<p>Bundle multiple physical links into one logical link for bandwidth and redundancy.</p>
<ul>
<li><strong>LACP (802.3ad)</strong> — the open standard, negotiates dynamically (<code>active</code> / <code>passive</code>)</li>
<li><strong>PAgP</strong> — Cisco proprietary</li>
<li><strong>Static / "on"</strong> — no negotiation; misconfiguration causes loops</li>
</ul>` },
      { t: 'The gotcha worth volunteering', h: `<p>Traffic is hashed <strong>per flow</strong> (src/dst MAC, IP, or port), so a <strong>single TCP session never exceeds one member link's speed</strong>. Four 1G links give you 4G of aggregate capacity across many flows, not a 4G single transfer. If one big backup job is the problem, aggregation won't fix it — a faster single link will.</p>` }
    ]
  },
  {
    id: 'net-osi',
    icon: '📚',
    layer: 'Foundations',
    title: 'The Layer Models and Encapsulation',
    tagline: 'OSI, TCP/IP, and the one encapsulation fact interviewers probe.',
    explain: `Seven layers is just a way of saying "each level solves one problem and hands the rest down." Your HTTP call knows nothing about cables; the cable knows nothing about HTTP. Each layer wraps the one above it in its own envelope — which is exactly what you already do with a request body inside an HTTP request inside a TLS session.`,
    tags: ['OSI', 'encapsulation', 'PDU'],
    blocks: [
      { t: 'OSI', h: `<table class="net-table"><thead><tr><th>OSI</th><th>Name</th><th>PDU</th><th>Devices</th><th>Protocols</th></tr></thead><tbody>
<tr><td>7</td><td>Application</td><td>Data</td><td>—</td><td>HTTP, DNS, SMTP, LDAP, FTP</td></tr>
<tr><td>6</td><td>Presentation</td><td>Data</td><td>—</td><td>TLS, JPEG, ASCII</td></tr>
<tr><td>5</td><td>Session</td><td>Data</td><td>—</td><td>NetBIOS, RPC</td></tr>
<tr><td>4</td><td>Transport</td><td>Segment</td><td>L4 firewall, L4 LB</td><td>TCP, UDP</td></tr>
<tr><td>3</td><td>Network</td><td>Packet</td><td>Router, L3 switch</td><td>IP, ICMP, OSPF, BGP</td></tr>
<tr><td>2</td><td>Data Link</td><td>Frame</td><td>Switch, bridge, NIC</td><td>Ethernet, 802.1Q, ARP*, STP</td></tr>
<tr><td>1</td><td>Physical</td><td>Bits</td><td>Hub, cable, repeater</td><td>RJ45, fiber, 1000BASE-T</td></tr>
</tbody></table>
<p>*ARP straddles L2/L3. If asked, say <em>"it lives at L2 but resolves L3 addresses"</em> — that answer signals you actually understand it.</p>
<p>The TCP/IP model collapses this to 4: Application (5–7), Transport (4), Internet (3), Link (1–2). Mnemonic for 7→1: <strong>A</strong>ll <strong>P</strong>eople <strong>S</strong>eem <strong>T</strong>o <strong>N</strong>eed <strong>D</strong>ata <strong>P</strong>rocessing.</p>` },
      { t: 'Encapsulation', h: `<pre class="net-pre">[ HTTP payload ]
[ TCP hdr | HTTP payload ]                       &lt;- segment
[ IP hdr | TCP hdr | HTTP payload ]              &lt;- packet
[ Eth hdr | IP hdr | TCP hdr | payload | FCS ]   &lt;- frame</pre>
<p>Key point interviewers probe: <strong>the Ethernet header is rewritten at every hop; the IP header is not.</strong> Source/destination MAC change hop to hop, source/destination IP stay the same end to end (absent NAT), and TTL decrements by 1 per router.</p>` }
    ]
  },
  {
    id: 'net-tcp-udp',
    icon: '🤝',
    layer: 'L4 Transport',
    title: 'TCP vs UDP, Handshake and Socket States',
    tagline: 'CLOSE_WAIT vs TIME_WAIT is the question most candidates get backwards.',
    explain: `TCP is a phone call: you connect, you confirm every sentence was heard, you hang up properly. UDP is a postcard: write it, send it, never find out if it arrived. The socket states are just the status line of that phone call, and knowing two of them tells you whether a bug is yours or the network's.`,
    tags: ['TCP', 'UDP', 'handshake', 'sockets'],
    blocks: [
      { t: 'The comparison', h: `<table class="net-table"><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td>Connection</td><td>Yes (handshake)</td><td>No</td></tr>
<tr><td>Ordering</td><td>Guaranteed (sequence numbers)</td><td>None</td></tr>
<tr><td>Delivery</td><td>Guaranteed (ACK + retransmit)</td><td>Best effort</td></tr>
<tr><td>Flow control</td><td>Yes (window)</td><td>No</td></tr>
<tr><td>Congestion control</td><td>Yes</td><td>No</td></tr>
<tr><td>Header size</td><td>20 bytes min</td><td>8 bytes</td></tr>
<tr><td>Use cases</td><td>HTTP, SSH, DB, LDAP</td><td>DNS, DHCP, VoIP, video, SNMP, syslog</td></tr>
</tbody></table>
<p>DNS is the classic trick: <strong>UDP/53</strong> for normal queries, <strong>TCP/53 for zone transfers and responses over 512 bytes</strong>.</p>` },
      { t: 'Three-way handshake and teardown', h: `<pre class="net-pre">Client                         Server
  |------ SYN (seq=x) ---------&gt;|
  |&lt;-- SYN-ACK (seq=y, ack=x+1)-|
  |------ ACK (ack=y+1) -------&gt;|
        connection ESTABLISHED</pre>
<pre class="net-pre">  |------ FIN ----------------&gt;|
  |&lt;----- ACK -----------------|
  |&lt;----- FIN -----------------|
  |------ ACK ----------------&gt;|   client -&gt; TIME_WAIT (2*MSL, usually 60s)</pre>` },
      { t: "TCP states you'll actually see in ss -tan", h: `<ul>
<li><strong>LISTEN</strong> — server socket waiting</li>
<li><strong>SYN-SENT</strong> — client sent SYN, no reply yet. Piles up = firewall dropping silently, or host down</li>
<li><strong>SYN-RECV</strong> — server got SYN, sent SYN-ACK, waiting. Mass SYN-RECV = SYN flood or asymmetric routing</li>
<li><strong>ESTABLISHED</strong> — normal</li>
<li><strong>CLOSE_WAIT</strong> — remote sent FIN, <strong>your app hasn't closed the socket</strong>. This is an application bug, not a network bug. Leaked JDBC connections and unclosed HttpClient instances show up here</li>
<li><strong>TIME_WAIT</strong> — you closed first and are waiting out stray packets. Thousands is normal on a busy client or proxy, not a problem by itself</li>
<li><strong>FIN_WAIT_2</strong> — you sent FIN, the peer ACKed but never sent its own FIN</li>
</ul>
<p><strong>Interview gold:</strong> "CLOSE_WAIT means the application didn't call close(). TIME_WAIT means we initiated the close and we're waiting out the 2×MSL timer."</p>` },
      { t: 'Why the handshake matters to you', h: `<p>A WebLogic managed server that won't join a cluster, an Oracle listener refusing connections on 1521, a Spring Boot app timing out to an external API — all diagnosed by asking: <em>did we get past SYN?</em> <code>telnet host port</code> or <code>nc -zv host port</code> answers that in two seconds.</p>
<ul>
<li><strong>Connection refused (RST)</strong> → host reachable, nothing listening on that port</li>
<li><strong>Connection timeout (no response)</strong> → firewall dropping, wrong IP, or host down</li>
</ul>
<p>Immediate reject vs hang is the single fastest way to split "network" from "service".</p>` }
    ]
  },
  {
    id: 'net-mtu',
    icon: '📏',
    layer: 'L4 Transport',
    title: 'MTU, MSS and Path MTU Discovery',
    tagline: 'Small requests work, large ones hang — the signature of a PMTUD blackhole.',
    explain: `Every link has a maximum packet size. If something along the path can't fit your packet, it's supposed to send back a "too big" message — but firewalls often block that message, so the sender never learns and just keeps retrying. That's why the symptom is so distinctive: small requests work, large ones hang forever.`,
    tags: ['MTU', 'MSS', 'PMTUD', 'VPN'],
    blocks: [
      { t: 'The numbers', h: `<ul>
<li><strong>MTU</strong> = largest frame payload the link carries. Ethernet default <strong>1500 bytes</strong></li>
<li><strong>MSS</strong> = largest TCP payload = MTU − IP header (20) − TCP header (20) = <strong>1460</strong> on standard Ethernet</li>
<li><strong>Jumbo frames</strong> = 9000 MTU, used on storage and backup networks. Must be consistent end to end or you get silent blackholing</li>
</ul>` },
      { t: 'Path MTU Discovery', h: `<p>The sender sets the <strong>DF</strong> (Don't Fragment) bit; a router that can't fit the packet returns <strong>ICMP Type 3 Code 4</strong> "Fragmentation Needed". If a firewall blocks ICMP, PMTUD breaks and you get the classic symptom: <strong>small requests work, large ones hang</strong> — the TCP handshake succeeds, then the connection dies mid-transfer.</p>
<p>That shows up over VPN tunnels constantly (IPsec adds ~50–60 bytes of overhead). Fix: lower the MTU on the tunnel interface, or clamp MSS to ~1360.</p>
<pre class="net-pre">ping -M do -s 1472 8.8.8.8      # Linux: 1472 + 28 = 1500
ping -f -l 1472 8.8.8.8         # Windows</pre>
<p>Drop the size until it passes; that value plus 28 is your path MTU.</p>` }
    ]
  },
  {
    id: 'net-arp',
    icon: '📣',
    layer: 'L2 Data Link',
    title: 'ARP',
    tagline: 'Resolves an IP to a MAC on the local segment only.',
    explain: `IP addresses tell you where something lives across the whole internet; MAC addresses only mean anything on your local wire. ARP is the shout that translates one into the other: "who has 192.168.1.50? Tell me your hardware address so I can actually put a frame on the wire."`,
    tags: ['ARP', 'gratuitous ARP', 'spoofing'],
    blocks: [
      { t: 'How it works', h: `<pre class="net-pre">Host A wants 192.168.1.50
A broadcasts: "Who has 192.168.1.50? Tell 192.168.1.10"  (dest MAC ff:ff:ff:ff:ff:ff)
Host B unicasts back: "192.168.1.50 is at 00:1a:2b:3c:4d:5e"
A caches it (default ~4 hours Linux, 2 min Windows)</pre>
<p>If the destination is <strong>off-subnet</strong>, the host ARPs for its <strong>default gateway</strong> instead, and sends the frame to the router's MAC with the remote host's IP still in the IP header.</p>
<p>Commands: <code>arp -a</code>, <code>ip neigh show</code>, <code>arp -d &lt;ip&gt;</code> to clear one entry.</p>` },
      { t: 'The three variants worth naming', h: `<ul>
<li><strong>Gratuitous ARP</strong> — an unsolicited announcement of your own IP/MAC. Used on failover so switches update their tables when a VIP moves. If a load balancer or cluster VIP fails over and traffic doesn't follow, stale ARP is the first suspect</li>
<li><strong>Proxy ARP</strong> — a router answers ARP on behalf of a host in another subnet</li>
<li><strong>ARP spoofing</strong> — an attacker replies with their own MAC and becomes MITM. Mitigate with Dynamic ARP Inspection + DHCP snooping</li>
</ul>` }
    ]
  },
  {
    id: 'net-dns',
    icon: '🌐',
    layer: 'Services & Apps',
    title: 'DNS',
    tagline: 'Record types, resolution flow, and the failures that look like "the network is down".',
    explain: `DNS turns a name into an address. Nearly every DNS incident you'll ever see is really a <em>caching</em> incident — somebody changed a record and the old answer is still sitting in a cache somewhere with time left on its clock.`,
    tags: ['DNS', 'TTL', 'dig'],
    blocks: [
      { t: 'Record types', h: `<table class="net-table"><thead><tr><th>Type</th><th>Purpose</th></tr></thead><tbody>
<tr><td>A</td><td>hostname → IPv4</td></tr>
<tr><td>AAAA</td><td>hostname → IPv6</td></tr>
<tr><td>CNAME</td><td>alias → another name (can't coexist with other records at the same name, can't sit at the zone apex)</td></tr>
<tr><td>MX</td><td>mail server + priority (lower = preferred)</td></tr>
<tr><td>NS</td><td>delegates a zone to nameservers</td></tr>
<tr><td>PTR</td><td>IP → hostname (reverse, lives in in-addr.arpa)</td></tr>
<tr><td>TXT</td><td>arbitrary text: SPF, DKIM, domain verification</td></tr>
<tr><td>SRV</td><td>service location: port + host, used by LDAP/AD/SIP</td></tr>
<tr><td>SOA</td><td>zone authority + serial + TTLs</td></tr>
</tbody></table>` },
      { t: 'Resolution flow', h: `<pre class="net-pre">1. Browser cache
2. OS cache (Windows: DNS Client service; Linux: nscd/systemd-resolved, often none)
3. /etc/hosts or C:\\Windows\\System32\\drivers\\etc\\hosts
4. Configured recursive resolver (DHCP-provided or 8.8.8.8)
5. Resolver: root (.) -&gt; TLD (.com) -&gt; authoritative (example.com) -&gt; answer
6. Answer cached for TTL seconds at each layer</pre>
<p>The client makes an <strong>iterative</strong> ask to the resolver; the resolver does the <strong>recursive</strong> work.</p>` },
      { t: 'Commands', h: `<pre class="net-pre">dig example.com A +short
dig @8.8.8.8 example.com          # query a specific server, bypass the local resolver
dig example.com +trace            # full delegation path from root - best debugging tool
dig -x 8.8.8.8                    # reverse lookup
nslookup example.com
host example.com
resolvectl status                 # what resolver is Linux actually using
ipconfig /flushdns                # Windows</pre>` },
      { t: 'What gets asked', h: `<ul>
<li><strong>"Works by IP but not by name"</strong> → DNS. Check resolver config, then <code>dig @&lt;resolver&gt;</code> directly, then look for a bad /etc/hosts entry, then the search-domain suffix</li>
<li><strong>"Changed the record but half the users get the old IP"</strong> → TTL still cached. Lower the TTL to 300 <em>before</em> a planned migration</li>
<li><strong>Why can't you CNAME the apex?</strong> A CNAME can't coexist with the SOA/NS records required at the zone root. Providers work around it with ALIAS/ANAME records</li>
<li><strong>Round-robin DNS is not load balancing.</strong> No health checks, and clients cache — a dead host keeps getting traffic until the TTL expires</li>
</ul>
<p>Java-specific, worth mentioning if they ask about apps: the JVM caches DNS. <code>networkaddress.cache.ttl</code> defaults to 30 s with a security manager, and older JVMs cached forever. That bit a lot of people during AWS failovers.</p>` }
    ]
  },
  {
    id: 'net-dhcp',
    icon: '🎫',
    layer: 'Services & Apps',
    title: 'DHCP — DORA',
    tagline: '169.254.x.x means nobody answered. New VLAN, nobody gets an IP? Missing ip helper-address.',
    explain: `How a device that knows nothing gets an IP address, a gateway and a DNS server — four broadcast messages and it's on the network. And if you ever see an address starting <code>169.254</code>, that is the device saying "I asked and nobody answered."`,
    tags: ['DHCP', 'DORA', 'relay', 'APIPA'],
    blocks: [
      { t: 'The exchange', h: `<pre class="net-pre">DISCOVER  client broadcast (0.0.0.0 -&gt; 255.255.255.255, UDP 67)
OFFER     server offers an address
REQUEST   client broadcasts acceptance (so other servers withdraw their offers)
ACK       server confirms, sends lease + gateway + DNS + domain</pre>
<p>Lease renewal starts at <strong>T1 (50% of the lease)</strong>, unicast to the original server.</p>` },
      { t: 'The two facts that get asked', h: `<ul>
<li>Broadcasts don't cross routers, so a DHCP server on another subnet needs an <strong>IP helper-address</strong> (DHCP relay) configured on the router or SVI. Classic question: <em>"new VLAN, nobody gets an IP"</em> → missing <code>ip helper-address</code></li>
<li><strong>169.254.x.x</strong> = APIPA / link-local. It means the client never heard from a DHCP server. Check the switchport VLAN, the relay, and the scope for exhaustion</li>
</ul>` }
    ]
  },
  {
    id: 'net-url',
    icon: '⌨️',
    layer: 'Foundations',
    title: 'What Happens When You Type a URL',
    tagline: 'The most common opening question in the industry, and a free layup. Aim for 3 minutes.',
    explain: `The classic opening question in this industry, and a free layup: it lets you walk the entire stack in three minutes. It's also the one place where your application-side experience is an advantage rather than a gap, because steps 4 through 8 are where you've actually lived.`,
    tags: ['end-to-end', 'DNS', 'TLS', 'HTTP'],
    blocks: [
      { t: 'The script', h: `<ol>
<li><strong>Parse the URL</strong> — scheme, host, port (443 default), path</li>
<li><strong>DNS resolution</strong> — browser cache → OS cache → hosts file → recursive resolver → root/TLD/authoritative → A record returned</li>
<li><strong>ARP</strong> — the host determines the destination is off-subnet and ARPs for the default gateway's MAC (or reads it from cache)</li>
<li><strong>TCP handshake</strong> — SYN / SYN-ACK / ACK to port 443. Each router along the path decrements TTL, rewrites L2 headers, and forwards on longest-prefix match</li>
<li><strong>NAT</strong> — the home/office router rewrites the private source IP and port to its public IP and records the translation in its state table</li>
<li><strong>TLS handshake</strong> — ClientHello (with SNI so the server knows which cert to present, plus supported ciphers), ServerHello + certificate, key exchange (ECDHE), Finished. The client validates the cert chain to a trusted root, checks CN/SAN against the hostname, checks expiry and revocation</li>
<li><strong>HTTP request</strong> — GET / with Host header, cookies, Accept headers</li>
<li><strong>Server side</strong> — may hit an L7 load balancer, which terminates TLS, picks a backend by algorithm and health, and forwards to an app server. Your world: WebLogic behind OHS/nginx, session affinity by JSESSIONID</li>
<li><strong>Response</strong> — status, headers, body. The browser parses HTML and fires more requests for CSS/JS/images (HTTP/2 multiplexes them over one connection)</li>
<li><strong>Render</strong>, then the connection closes or stays alive (keep-alive)</li>
</ol>
<p>Add one line at the end: <em>"and where I've spent most of my debugging time is steps 4 through 8."</em> That invites them into your actual experience.</p>` }
    ]
  },
  {
    id: 'net-subnetting',
    icon: '🔢',
    layer: 'L3 Network',
    title: 'Subnetting',
    tagline: 'This is the filter. Bad at subnetting = no offer, regardless of everything else.',
    explain: `A subnet mask draws a line through an address: everything left of the line says <em>which network</em>, everything right says <em>which device on it</em>. All of subnetting is finding that line and counting. It's also the pass/fail part of a networking interview — being slow here undoes everything else.`,
    tags: ['CIDR', 'VLSM', 'RFC 1918'],
    blocks: [
      { t: 'Memorize this table', h: `<table class="net-table"><thead><tr><th>CIDR</th><th>Mask</th><th>Block size</th><th>Total IPs</th><th>Usable hosts</th><th>/24s</th></tr></thead><tbody>
<tr><td>/8</td><td>255.0.0.0</td><td>—</td><td>16,777,216</td><td>16,777,214</td><td>65536</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>—</td><td>65,536</td><td>65,534</td><td>256</td></tr>
<tr><td>/20</td><td>255.255.240.0</td><td>16</td><td>4,096</td><td>4,094</td><td>16</td></tr>
<tr><td>/21</td><td>255.255.248.0</td><td>8</td><td>2,048</td><td>2,046</td><td>8</td></tr>
<tr><td>/22</td><td>255.255.252.0</td><td>4</td><td>1,024</td><td>1,022</td><td>4</td></tr>
<tr><td>/23</td><td>255.255.254.0</td><td>2</td><td>512</td><td>510</td><td>2</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>256</td><td>254</td><td>1</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>128</td><td>126</td><td>—</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>64</td><td>62</td><td>—</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>32</td><td>30</td><td>—</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>16</td><td>14</td><td>—</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>8</td><td>8</td><td>6</td><td>—</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>4</td><td>2</td><td>—</td></tr>
<tr><td>/31</td><td>255.255.255.254</td><td>2</td><td>2</td><td>2*</td><td>—</td></tr>
<tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>1</td><td>1</td><td>—</td></tr>
</tbody></table>
<p>Usable = total − 2 (network address + broadcast address). *<strong>/31</strong> is the exception: RFC 3021 allows both addresses on point-to-point links. /30 is the traditional choice for router-to-router links.</p>
<p>Octet values only ever come from <strong>128, 192, 224, 240, 248, 252, 254, 255</strong>. Learn those eight numbers and the block sizes 128/64/32/16/8/4/2/1 that pair with them.</p>` },
      { t: 'The method', h: `<p>Given <strong>172.16.35.100/20</strong> — find network, broadcast, range, host count.</p>
<ol>
<li>/20 = 255.255.<strong>240</strong>.0. The interesting octet is the 3rd</li>
<li>Block size = 256 − 240 = <strong>16</strong></li>
<li>Subnets in the 3rd octet step by 16: 0, 16, 32, <strong>48</strong>, 64…</li>
<li>35 falls between 32 and 48, so network = <strong>172.16.32.0</strong></li>
<li>Broadcast = one below the next block = <strong>172.16.47.255</strong></li>
<li>Usable = <strong>172.16.32.1 – 172.16.47.254</strong></li>
<li>Hosts = 2^(32−20) − 2 = 4096 − 2 = <strong>4094</strong></li>
</ol>
<p>Same method every time: find the interesting octet, get the block size, count up to the address, take the boundary below it.</p>` },
      { t: 'Worked examples', h: `<p><strong>192.168.10.77/26</strong> — mask 255.255.255.192, block 64, boundaries 0/64/128/192. 77 is in the 64 block → network <strong>192.168.10.64</strong>, broadcast <strong>192.168.10.127</strong>, range <strong>.65 – .126</strong>, 62 hosts.</p>
<p><strong>10.0.0.130/25</strong> — mask 255.255.255.128, block 128, boundaries 0/128. Network <strong>10.0.0.128</strong>, broadcast <strong>10.0.0.255</strong>, range <strong>.129 – .254</strong>, 126 hosts.</p>
<p><strong>203.0.113.45/28</strong> — block 16, boundaries 0/16/32/48. Network <strong>203.0.113.32</strong>, broadcast <strong>203.0.113.47</strong>, range <strong>.33 – .46</strong>, 14 hosts.</p>
<p><strong>Split 192.168.1.0/24 into subnets of at least 50 hosts each</strong> — 50 hosts needs 64 addresses → /26 (62 usable). Four subnets: .0/26, .64/26, .128/26, .192/26.</p>
<p><strong>How many /29s fit in a /24?</strong> 2^(29−24) = 32.</p>` },
      { t: 'VLSM', h: `<p>Variable Length Subnet Masking: carve one block into different-sized subnets instead of uniform ones. <strong>Always allocate largest first</strong>, or you fragment the space.</p>
<p>Given 192.168.1.0/24, needing 100 / 50 / 25 / 2 hosts:</p>
<table class="net-table"><thead><tr><th>Need</th><th>Size</th><th>Prefix</th><th>Subnet</th><th>Range</th></tr></thead><tbody>
<tr><td>100</td><td>128</td><td>/25</td><td>192.168.1.0/25</td><td>.1 – .126</td></tr>
<tr><td>50</td><td>64</td><td>/26</td><td>192.168.1.128/26</td><td>.129 – .190</td></tr>
<tr><td>25</td><td>32</td><td>/27</td><td>192.168.1.192/27</td><td>.193 – .222</td></tr>
<tr><td>2 (P2P link)</td><td>4</td><td>/30</td><td>192.168.1.224/30</td><td>.225 – .226</td></tr>
</tbody></table>` },
      { t: 'Private ranges (RFC 1918) and friends', h: `<table class="net-table"><thead><tr><th>Range</th><th>CIDR</th><th>Size</th></tr></thead><tbody>
<tr><td>10.0.0.0 – 10.255.255.255</td><td>10.0.0.0/8</td><td>16.7M</td></tr>
<tr><td>172.16.0.0 – 172.31.255.255</td><td>172.16.0.0/12</td><td>1M</td></tr>
<tr><td>192.168.0.0 – 192.168.255.255</td><td>192.168.0.0/16</td><td>65K</td></tr>
</tbody></table>
<p>The 172.16/12 boundary trips people up: it ends at <strong>172.31</strong>, not 172.16.</p>
<ul>
<li><strong>127.0.0.0/8</strong> loopback</li>
<li><strong>169.254.0.0/16</strong> APIPA / link-local</li>
<li><strong>224.0.0.0/4</strong> multicast</li>
<li><strong>100.64.0.0/10</strong> CGNAT (also what Tailscale uses)</li>
<li><strong>0.0.0.0/0</strong> default route / "any"</li>
</ul>` }
    ]
  },
  {
    id: 'net-nat',
    icon: '🔁',
    layer: 'L3 Network',
    title: 'NAT and PAT',
    tagline: 'NAT is not a firewall. Say this if they ask whether NAT provides security.',
    explain: `Your home has one public address and twenty devices. NAT is the router rewriting the return address on the way out and remembering the swap, so replies find their way back to the right device. It's the reason you can't just reach a machine sitting behind someone's home router.`,
    tags: ['NAT', 'PAT', 'port forwarding'],
    blocks: [
      { t: 'The four flavors', h: `<ul>
<li><strong>Static NAT</strong> — one private IP ↔ one public IP, permanent. Used for inbound servers</li>
<li><strong>Dynamic NAT</strong> — a pool of public IPs, first come first served</li>
<li><strong>PAT / NAT overload</strong> — many private IPs share one public IP, distinguished by source port. What every home and most office networks do</li>
<li><strong>Port forwarding / destination NAT</strong> — an inbound public:port mapped to an internal host</li>
</ul>
<p>The router keeps a translation table: <code>inside_local:port ↔ inside_global:port</code>. Return traffic gets matched against it and rewritten back.</p>` },
      { t: 'Why NAT breaks things', h: `<p>The outside can't originate connections inward without an explicit mapping. That's why you need port forwarding, a VPN, or a reverse tunnel to reach a home server. It also breaks protocols that embed IPs in the payload (FTP active mode, SIP), which is why ALGs exist.</p>
<p><strong>NAT is not a firewall.</strong> It's an address translator that happens to drop unsolicited inbound traffic.</p>` }
    ]
  },
  {
    id: 'net-ipv6',
    icon: '6️⃣',
    layer: 'L3 Network',
    title: 'IPv6 — concepts only',
    tagline: '/64 is always the subnet size. No broadcast, no NAT, NDP instead of ARP.',
    explain: `IPv4 ran out of addresses; IPv6 has effectively unlimited ones. Concepts only for this interview: subnets are always /64, there is no broadcast at all, and ARP is replaced by a mechanism built on ICMP.`,
    tags: ['IPv6', 'SLAAC', 'NDP'],
    blocks: [
      { t: 'What to know', h: `<ul>
<li>128 bits, written as 8 groups of 4 hex digits. <code>::</code> compresses one run of zeros, exactly once — <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code> → <code>2001:db8::ff00:42:8329</code></li>
<li><strong>/64 is the standard subnet size</strong>, always. The bottom 64 bits are the interface ID</li>
<li><strong>fe80::/10</strong> link-local, auto-configured on every interface, required for neighbor discovery</li>
<li><strong>fc00::/7</strong> unique local (the RFC 1918 equivalent) · <strong>2000::/3</strong> global unicast</li>
<li><strong>No broadcast.</strong> Multicast replaces it — <code>ff02::1</code> = all nodes, <code>ff02::2</code> = all routers</li>
<li><strong>NDP replaces ARP</strong> (uses ICMPv6 neighbor solicitation/advertisement)</li>
<li><strong>SLAAC</strong> — the host builds its own address from the router advertisement prefix. No DHCP required</li>
<li><strong>No NAT by design</strong> (NAT66 exists but is discouraged). The address space is large enough to give everything a routable address</li>
<li>Dual-stack is how migration actually happens</li>
</ul>` }
    ]
  },
  {
    id: 'net-cisco-cli',
    icon: '⌘',
    layer: 'Ops & Troubleshooting',
    title: 'Cisco Commands to Have Ready',
    tagline: 'Be able to say what each one shows — and how to read the output.',
    explain: `You will not be asked to configure a switch. You may well be asked what a command shows and how to read its output — especially which half of "up/up" is broken and what that tells you.`,
    tags: ['CLI', 'Cisco', 'show commands'],
    blocks: [
      { t: 'The commands', h: `<pre class="net-pre">show ip interface brief          # every interface, IP, admin status, line protocol
show interfaces status           # port status, VLAN, duplex, speed
show interfaces gi0/1            # errors, CRC, drops, duplex mismatches
show ip route                    # routing table
show ip route 10.1.1.50          # which route wins for this destination
show mac address-table           # MAC to port mapping
show arp / show ip arp           # IP to MAC
show vlan brief                  # VLANs and their access ports
show interfaces trunk            # trunk ports, allowed VLANs, native VLAN
show spanning-tree vlan 10       # root bridge, port roles/states
show cdp neighbors detail        # what's plugged into what (LLDP for multi-vendor)
show running-config interface gi0/1
show logging                     # syslog buffer
show version                     # model, IOS version, uptime</pre>` },
      { t: 'Reading show ip interface brief', h: `<ul>
<li><code>up / up</code> — good</li>
<li><code>up / down</code> — physical layer fine, protocol not (encapsulation mismatch, no keepalive, missing clock rate on serial)</li>
<li><code>down / down</code> — cable, SFP, remote end shut, or speed/duplex negotiation failure</li>
<li><code>administratively down / down</code> — someone typed <code>shutdown</code></li>
</ul>
<p>Counters worth knowing: <strong>CRC errors</strong> point to a bad cable, SFP, or duplex mismatch. <strong>Input errors + collisions on a full-duplex link</strong> almost always means duplex mismatch — one side hard-coded, one side auto.</p>` }
    ]
  },
  {
    id: 'net-troubleshooting',
    icon: '🔧',
    layer: 'Ops & Troubleshooting',
    title: 'Troubleshooting Methodology and Commands',
    tagline: 'State a method when asked. Interviewers care that you have one, not which one.',
    explain: `The method matters more than the tool. Establish the scope first (one user, or everyone?), then ask what changed, then work up or down the stack from wherever the evidence points. Saying that out loud is worth more than naming ten commands.`,
    tags: ['methodology', 'ping', 'traceroute', 'tcpdump'],
    blocks: [
      { t: 'Methodology', h: `<ul>
<li><strong>Bottom-up (L1→L7)</strong> — good when something is clearly broken. Start with link lights and cables</li>
<li><strong>Top-down (L7→L1)</strong> — good when one application misbehaves and everything else works</li>
<li><strong>Divide and conquer</strong> — start at L3 (<code>ping</code>) and go up or down based on the result. Fastest in practice</li>
<li><strong>Follow the path</strong> — trace the packet hop by hop: host → switch → gateway → firewall → WAN → remote</li>
</ul>
<p>The universal first question: <strong>what changed?</strong> Second: <strong>what's the actual scope?</strong> One user, one subnet, one application, or everyone. Scope tells you which layer to look at before you touch anything.</p>` },
      { t: 'Reachability', h: `<pre class="net-pre">ping -c 4 8.8.8.8              # L3 reachability + rough latency
ping -c 100 -i 0.2 host        # sustained, look for loss patterns
traceroute host                # UDP by default on Linux
traceroute -I host             # ICMP mode
traceroute -T -p 443 host      # TCP mode - gets through firewalls that block UDP/ICMP
tracert host                   # Windows, uses ICMP
mtr host                       # continuous traceroute + loss per hop. Best single tool
pathping host                  # Windows equivalent</pre>
<p><strong>Reading traceroute correctly</strong> — this separates seniors from juniors:</p>
<ul>
<li>Asterisks at a middle hop mean <strong>that router didn't reply to the probe</strong>, not that traffic stopped. Many routers deprioritize or block ICMP TTL-exceeded</li>
<li>Latency spikes at a middle hop that don't persist to the last hop are irrelevant. <strong>Only the final hop's latency matters</strong></li>
<li>Loss at hop 5 that doesn't appear at hops 6–10 is control-plane rate limiting, not a real problem</li>
<li>Paths can be asymmetric. What you see going out is not the return path</li>
</ul>` },
      { t: 'Ports and sockets', h: `<pre class="net-pre">ss -tulpn                      # listening TCP/UDP sockets with process (modern netstat)
ss -tan state established      # established connections
ss -tan | awk '{print $1}' | sort | uniq -c    # count by state - spot CLOSE_WAIT leaks
netstat -ano                   # Windows, with PID
lsof -i :8080                  # what's holding this port
nc -zv host 1521               # port open? fastest test there is
telnet host 7001               # same idea, universally available</pre>` },
      { t: 'HTTP / TLS timing', h: `<pre class="net-pre">curl -v https://host/path
curl -w "dns:%{time_namelookup} connect:%{time_connect} tls:%{time_appconnect} ttfb:%{time_starttransfer} total:%{time_total}\\n" -o /dev/null -s https://host
curl --resolve host:443:10.1.1.5 https://host/   # bypass DNS, test a specific backend
openssl s_client -connect host:443 -servername host   # cert chain, protocol, cipher
openssl x509 -in cert.pem -noout -text -dates         # what's in this cert, when does it expire</pre>
<p>That <code>curl -w</code> timing breakdown is a genuinely strong thing to demo — it splits "slow" into DNS vs TCP vs TLS vs server think-time in one command.</p>` },
      { t: 'Packet capture', h: `<pre class="net-pre">tcpdump -i any -nn host 10.1.1.5 and port 1521
tcpdump -i eth0 -nn 'tcp[tcpflags] &amp; (tcp-syn|tcp-rst) != 0'   # handshake problems only
tcpdump -i any -w capture.pcap -s 0                            # write for Wireshark</pre>
<p>Wireshark display filters: <code>tcp.flags.reset == 1</code>, <code>tcp.analysis.retransmission</code>, <code>http.response.code &gt;= 400</code>, <code>dns</code>, <code>tls.handshake.type == 1</code>, <code>ip.addr == 10.1.1.5 &amp;&amp; tcp.port == 443</code></p>` },
      { t: 'Interface and routing on the host', h: `<pre class="net-pre">ip addr show
ip route show
ip route get 8.8.8.8           # which interface and gateway will actually be used
ip neigh show                  # ARP cache
ethtool eth0                   # speed, duplex, link detected
route print                    # Windows</pre>` }
    ]
  },
  {
    id: 'net-symptoms',
    icon: '🚨',
    layer: 'Ops & Troubleshooting',
    title: 'Symptom → Cause Table',
    tagline: 'The lookup table for "here is what users are reporting — where do you start?"',
    explain: `The pattern-matching half of the job in one table: here's what the user reported, here's the usual culprit, here's the first thing to check. Interviewers love these because a real answer takes ten seconds.`,
    tags: ['diagnosis', 'symptoms'],
    blocks: [
      { t: 'Symptom → likely cause → first check', h: `<table class="net-table"><thead><tr><th>Symptom</th><th>Likely cause</th><th>First check</th></tr></thead><tbody>
<tr><td>169.254.x.x address</td><td>No DHCP reply</td><td>Switchport VLAN, <code>ip helper-address</code>, scope exhaustion</td></tr>
<tr><td>Ping by IP works, name fails</td><td>DNS</td><td><code>dig @resolver</code>, /etc/hosts, search domain</td></tr>
<tr><td>Connection refused instantly</td><td>Nothing listening</td><td><code>ss -tulpn</code> on the target, wrong port</td></tr>
<tr><td>Connection hangs then times out</td><td>Firewall silently dropping</td><td>ACL / security group, <code>traceroute -T -p &lt;port&gt;</code></td></tr>
<tr><td>Small requests OK, large hang</td><td>MTU / PMTUD blackhole</td><td><code>ping -M do -s 1472</code>, clamp MSS</td></tr>
<tr><td>Intermittent loss, CRC errors</td><td>Bad cable/SFP or duplex mismatch</td><td><code>show interfaces</code>, check both ends' duplex</td></tr>
<tr><td>Whole VLAN dies intermittently</td><td>STP loop / broadcast storm</td><td><code>show spanning-tree</code>, look for MAC flapping in logs</td></tr>
<tr><td>Works from one subnet not another</td><td>Routing or ACL</td><td><code>ip route get</code>, check the firewall rule direction</td></tr>
<tr><td>VIP failover, traffic doesn't follow</td><td>Stale ARP</td><td>Gratuitous ARP, clear ARP on the gateway</td></tr>
<tr><td>Slow only over VPN</td><td>MTU or tunnel congestion</td><td>MTU test, compare to the direct path</td></tr>
<tr><td>High latency, no loss</td><td>Congestion/bufferbloat or distance</td><td><code>mtr</code>, check interface utilization</td></tr>
<tr><td>SSL handshake fails</td><td>Cert chain, expiry, protocol/cipher mismatch, SNI</td><td><code>openssl s_client -servername</code></td></tr>
<tr><td>Half the users affected</td><td>One node in an LB pool</td><td>Test each backend with <code>curl --resolve</code></td></tr>
</tbody></table>` }
    ]
  },
  {
    id: 'net-ports',
    icon: '🚪',
    layer: 'Ops & Troubleshooting',
    title: 'Ports Cheat Sheet',
    tagline: 'Know 1521 and 7001 cold — they are the ones your own background makes fair game.',
    explain: `A port number is just "which application on that machine". These are the well-known ones — pay particular attention to 1521 and 7001, because your own background makes those completely fair game.`,
    tags: ['ports', 'well-known'],
    blocks: [
      { t: 'Well-known ports', h: `<table class="net-table"><thead><tr><th>Port</th><th>Service</th><th>Port</th><th>Service</th></tr></thead><tbody>
<tr><td>20/21</td><td>FTP data / control</td><td>445</td><td>SMB</td></tr>
<tr><td>22</td><td>SSH / SCP / SFTP</td><td>465/587</td><td>SMTPS / submission</td></tr>
<tr><td>23</td><td>Telnet</td><td>514</td><td>Syslog (UDP)</td></tr>
<tr><td>25</td><td>SMTP</td><td>636</td><td>LDAPS</td></tr>
<tr><td>53</td><td>DNS (UDP + TCP)</td><td>993/995</td><td>IMAPS / POP3S</td></tr>
<tr><td>67/68</td><td>DHCP server / client</td><td>1433</td><td>SQL Server</td></tr>
<tr><td>69</td><td>TFTP</td><td>1521</td><td><strong>Oracle DB listener</strong></td></tr>
<tr><td>80</td><td>HTTP</td><td>3306</td><td>MySQL</td></tr>
<tr><td>88</td><td>Kerberos</td><td>3389</td><td>RDP</td></tr>
<tr><td>110</td><td>POP3</td><td>5432</td><td>PostgreSQL</td></tr>
<tr><td>123</td><td>NTP</td><td>6379</td><td>Redis</td></tr>
<tr><td>143</td><td>IMAP</td><td>7001/7002</td><td><strong>WebLogic admin HTTP/HTTPS</strong></td></tr>
<tr><td>161/162</td><td>SNMP / trap</td><td>8080</td><td>HTTP alt / Tomcat</td></tr>
<tr><td>179</td><td>BGP (TCP)</td><td>9092</td><td>Kafka</td></tr>
<tr><td>389</td><td>LDAP</td><td>27017</td><td>MongoDB</td></tr>
<tr><td>443</td><td>HTTPS</td><td>—</td><td>—</td></tr>
</tbody></table>` }
    ]
  },
  {
    id: 'net-firewalls',
    icon: '🛡️',
    layer: 'Ops & Troubleshooting',
    title: 'Firewalls, ACLs and Cloud Security Groups',
    tagline: 'Top-down, first match wins, implicit deny at the end.',
    explain: `A firewall rule list is read top to bottom, first match wins, and anything not explicitly allowed is denied at the end. The stateful-versus-stateless distinction decides one practical thing: whether you have to write the return-traffic rule yourself.`,
    tags: ['ACL', 'firewall', 'security group', 'NACL'],
    blocks: [
      { t: 'Firewall types', h: `<ul>
<li><strong>Stateless</strong> (packet filter / standard ACL) — evaluates each packet alone. You must write return rules explicitly</li>
<li><strong>Stateful</strong> — tracks connections; return traffic for an allowed outbound flow is permitted automatically. Everything modern</li>
<li><strong>NGFW / L7</strong> — inspects application content, does TLS interception, IPS, app identification</li>
</ul>
<p>ACL rules: <strong>top-down, first match wins, implicit deny at the end.</strong> Order matters, and a permit after a broader deny never fires. Direction matters too — inbound vs outbound is relative to the interface.</p>` },
      { t: 'Cloud vocabulary', h: `<ul>
<li><strong>Security group</strong> — stateful, instance-level, allow rules only</li>
<li><strong>NACL</strong> — stateless, subnet-level, allow <em>and</em> deny, numbered and evaluated in order. Because it's stateless you need an outbound rule for ephemeral ports (1024–65535) on return traffic. This is the most common AWS networking gotcha</li>
</ul>` }
    ]
  },
  {
    id: 'net-lb',
    icon: '⚖️',
    layer: 'Services & Apps',
    title: 'Load Balancing',
    tagline: 'Your WebLogic experience maps directly here — make it a talking point.',
    explain: `A load balancer takes one address and spreads requests across many servers. This is the card where your WebLogic experience is genuinely relevant experience — sticky sessions and health checks are problems you have already solved in production.`,
    tags: ['L4', 'L7', 'sticky sessions', 'health checks'],
    blocks: [
      { t: 'L4 vs L7', h: `<table class="net-table"><thead><tr><th></th><th>L4</th><th>L7</th></tr></thead><tbody>
<tr><td>Sees</td><td>IP + port</td><td>HTTP headers, URL, cookies</td></tr>
<tr><td>Speed</td><td>Faster, less CPU</td><td>Slower, more capable</td></tr>
<tr><td>Can do</td><td>TCP passthrough, any protocol</td><td>Path routing, header rewrite, TLS termination, sticky sessions by cookie</td></tr>
<tr><td>Examples</td><td>AWS NLB, LVS, HAProxy TCP mode</td><td>AWS ALB, nginx, F5, Apache OHS</td></tr>
</tbody></table>
<p>Algorithms: round robin, weighted round robin, least connections, IP hash, least response time.</p>` },
      { t: 'Session persistence, health checks, XFF', h: `<ul>
<li><strong>Session persistence</strong> — a stateful app server holds session data in memory, so a user bounced to a different node loses their session. Options: sticky cookie (JSESSIONID with a route suffix), source-IP hash, or externalize sessions (in-memory replication in a WebLogic cluster, or Redis). Externalizing is the correct answer architecturally</li>
<li><strong>Health checks</strong> — TCP connect (shallow, catches a dead process) vs HTTP GET /health (deep, catches a process that's up but broken, like an app that lost its DB connection pool). Always argue for the deep check</li>
<li><strong>X-Forwarded-For</strong> — after a proxy the app sees the proxy's IP; XFF carries the original client IP. If your logs or rate limiting show every request from one IP, this is why</li>
</ul>` }
    ]
  },
  {
    id: 'net-tls',
    icon: '🔐',
    layer: 'Services & Apps',
    title: 'TLS',
    tagline: "Keystore is my identity, truststore is who I trust. Reversing them is the classic WebLogic SSL mistake.",
    explain: `The handshake that turns an ordinary TCP connection into an encrypted one, plus proof you're talking to who you think you are. Keystore is <em>my</em> identity; truststore is <em>who I trust</em> — and swapping those two is the single most common Java SSL mistake.`,
    tags: ['TLS', 'SNI', 'certificates', 'mTLS'],
    blocks: [
      { t: 'The handshake, short version', h: `<ol>
<li><strong>ClientHello</strong> — supported TLS versions, cipher suites, and <strong>SNI</strong> (which hostname it wants)</li>
<li><strong>ServerHello</strong> — chosen version + cipher, server certificate + intermediate chain</li>
<li><strong>Key exchange</strong> — ECDHE gives forward secrecy; the session key is never transmitted</li>
<li><strong>Finished</strong>, then symmetric encryption (AES-GCM) for the actual data</li>
</ol>
<p>TLS 1.3 cuts this to one round trip and removes the old cipher suites.</p>` },
      { t: 'What actually breaks', h: `<ul>
<li><strong>Keystore</strong> = my identity, my private key + cert. <strong>Truststore</strong> = who I trust, CA certs. In Java: <code>javax.net.ssl.keyStore</code> and <code>trustStore</code></li>
<li>Cert validation: chains to a trusted root, hostname matches <strong>CN or SAN</strong> (modern clients ignore CN entirely and require SAN), not expired, not revoked</li>
<li>Common failures: missing intermediate cert (works in browsers that cache intermediates, fails in Java), self-signed cert not in the truststore, expired cert, hostname mismatch, no cipher in common</li>
<li><strong>mTLS</strong> — the server also validates a client cert. Used for service-to-service and B2B integrations</li>
</ul>
<p>Debug with <code>openssl s_client -connect host:443 -servername host -showcerts</code> and Java's <code>-Djavax.net.debug=ssl:handshake</code>.</p>` }
    ]
  },
  {
    id: 'net-vpn',
    icon: '🕳️',
    layer: 'Services & Apps',
    title: 'VPN and Overlay Networks',
    tagline: 'IPsec overhead is why "slow only over the VPN" is almost always MTU.',
    explain: `An encrypted tunnel that makes a remote network behave as if it were local. The one fact that pays off in an interview: a tunnel adds overhead to every single packet, which is why "slow only over the VPN" is nearly always a packet-size problem rather than a bandwidth one.`,
    tags: ['IPsec', 'WireGuard', 'split tunnel'],
    blocks: [
      { t: 'The options', h: `<ul>
<li><strong>IPsec</strong> — L3 tunnels, the site-to-site standard. IKE phase 1 (authenticate, build the management tunnel) then phase 2 (build the data SAs). Adds ~50–60 bytes of overhead, so MTU matters</li>
<li><strong>SSL/TLS VPN</strong> — client remote access over 443, gets through restrictive firewalls</li>
<li><strong>WireGuard</strong> — modern, small, fast, UDP, key-pair based. What Tailscale is built on</li>
<li><strong>Tailscale / overlay mesh</strong> — WireGuard plus a coordination server for key distribution and NAT traversal. Nodes connect peer-to-peer when they can and relay through DERP when they can't. Uses 100.64.0.0/10</li>
<li><strong>Split tunneling</strong> — only corporate subnets go through the tunnel, everything else goes direct. Faster for the user, less visibility for security</li>
</ul>` }
    ]
  },
  {
    id: 'net-containers',
    icon: '🐳',
    layer: 'Services & Apps',
    title: 'Docker and Container Networking',
    tagline: 'Worth ten minutes because it will come up and most network candidates cannot answer it.',
    explain: `Container networking in one line: by default each container gets a private address and shares the host's address to get out, which is why you have to explicitly publish a port to reach it from outside. Most networking candidates can't answer this — you can.`,
    tags: ['Docker', 'bridge', 'Kubernetes'],
    blocks: [
      { t: 'Docker network modes', h: `<ul>
<li><strong>bridge</strong> (default) — containers get a private IP on docker0 and NAT out through the host's IP. Inbound requires <code>-p 8080:8080</code> to publish</li>
<li><strong>host</strong> — the container shares the host's network namespace: no isolation, no NAT, no port mapping needed</li>
<li><strong>none</strong> — no networking</li>
<li><strong>overlay</strong> — multi-host, used by Swarm and Kubernetes</li>
</ul>
<p>User-defined bridge networks give containers <strong>DNS resolution by container name</strong>; the default bridge does not. And <code>localhost</code> inside a container is the container, not the host — use <code>host.docker.internal</code> (Mac/Windows) or the gateway IP.</p>` },
      { t: 'Kubernetes in one line', h: `<p>Every pod gets a routable IP, Services provide a stable virtual IP with kube-proxy/iptables load balancing, and Ingress is the L7 entry point.</p>` }
    ]
  },
  {
    id: 'net-monitoring',
    icon: '📡',
    layer: 'Ops & Troubleshooting',
    title: 'Monitoring and Wireless',
    tagline: 'Skim-level breadth — enough to answer, not enough to get cornered.',
    explain: `Breadth, not depth. Enough vocabulary to hold a conversation about how a team finds out something broke, plus the two or three Wi-Fi facts that always come up.`,
    tags: ['SNMP', 'NetFlow', 'Wi-Fi'],
    blocks: [
      { t: 'Monitoring', h: `<p><strong>SNMP</strong> (v2c community strings in clear text, v3 has auth + encryption; polling), <strong>NetFlow/sFlow/IPFIX</strong> (who talked to whom and how much), <strong>syslog</strong> (UDP 514, centralized), <strong>SPAN / port mirroring</strong> (copy traffic to an analyzer). Tools by name: SolarWinds, PRTG, Zabbix, LibreNMS, Grafana + Prometheus.</p>` },
      { t: 'Wireless', h: `<p><strong>2.4 GHz</strong> (3 non-overlapping channels 1/6/11, better range, more interference) vs <strong>5 GHz</strong> (many channels, more bandwidth, shorter range) vs <strong>6 GHz</strong> (Wi-Fi 6E). Standards: 802.11n/ac/ax (Wi-Fi 6)/be (Wi-Fi 7). Security: WPA2-PSK, WPA2-Enterprise (802.1X + RADIUS), WPA3-SAE. Common problems: co-channel interference, too-high transmit power causing sticky clients, roaming without 802.11k/r/v.</p>` }
    ]
  },
  {
    id: 'net-framing',
    icon: '🎤',
    layer: 'Interview Strategy',
    title: 'Framing Your Background, STAR Stories, Questions to Ask',
    tagline: "You're a software engineer applying for network work. Own it rather than apologizing for it.",
    explain: `You're a software engineer applying for network work, and he already knows it — he said so in writing. Own the gap in one sentence, then redirect to the thing you genuinely have: the discipline of proving where a problem lives instead of handing it to the next team.`,
    tags: ['STAR', 'framing', 'closing'],
    blocks: [
      { t: 'The framing line', h: `<p><em>"I've spent six years on the application side of the network. That means I've debugged connectivity from the perspective of the thing everyone blames first, so I'm used to proving where a problem actually lives instead of handing it off. I've configured WebLogic clusters, TLS keystores, load balancer integration, and cross-site database connectivity. What I'm building now is the depth below layer 4, which is why I've been working through subnetting, switching, and routing systematically."</em></p>
<p>If they ask why you're switching, keep it forward-looking and short. No complaints about the current employer.</p>` },
      { t: 'Three STAR stories — write these out, 90 seconds each, all with a number in them', h: `<p><strong>Template:</strong> Situation (context + stakes) → Task (my responsibility) → Action (what I specifically did, with tools named) → Result (measured outcome + what I changed afterwards).</p>
<ul>
<li><strong>Story 1 — Connectivity incident.</strong> A WebLogic cluster or PLM environment losing connectivity. Name the tools: <code>ss</code>, <code>telnet</code>, thread dumps, listener logs. Name how you isolated the layer, the fix, and how long the outage was</li>
<li><strong>Story 2 — Cross-system integration failure.</strong> An SAP MM sync or client integration failing. This one shows you can trace a request across firewall boundaries, systems, and teams that don't report to you. Emphasize how you <em>proved</em> which side was at fault instead of arguing</li>
<li><strong>Story 3 — Something you prevented or improved.</strong> Monitoring you added, a repeated failure you rooted out, a runbook you wrote. This shows seniority — mention delegation and how you got the team to reproduce the diagnosis without you</li>
</ul>` },
      { t: 'Questions to ask them (pick 3)', h: `<ul>
<li>What does the network stack actually look like, and how much is on-prem vs cloud?</li>
<li>What's the change-management process for network changes, and who approves?</li>
<li>What's the monitoring and alerting stack? How do you find out about an outage?</li>
<li>What's the on-call rotation and typical incident volume?</li>
<li>What's the split between project work and break/fix?</li>
<li>Where is the team's documentation debt worst?</li>
<li>What would a successful first 90 days look like?</li>
</ul>
<p>Avoid asking only about salary and remote policy in the technical round.</p>` }
    ]
  }
];

/**
 * Q&A drills — the model answers, grouped into sections and rendered as
 * expandable rows (same shape as supermicro.js / msi.js).
 */
const networkingQuestions = [
  {
    id: 'net-q-priority',
    title: 'Priority Q&A — L1 / L2 / L3',
    desc: 'The questions that map directly onto the six topics the hiring manager named. Cover the answer, say yours out loud, then compare.',
    questions: [
      { d: 'medium', q: 'What Layer 2 control protocols do you know, besides spanning tree?',
        a: `<p>The ones I'd name are:</p>
<ul>
<li><strong>LACP</strong> — <em>Link Aggregation Control Protocol</em>, 802.3ad. Bundles several physical cables into one logical link for bandwidth and redundancy</li>
<li><strong>LLDP</strong> — <em>Link Layer Discovery Protocol</em>, 802.1AB. Switches announce who they are and which port you're connected to, so you can see what's plugged in where. <strong>CDP</strong> is Cisco's older equivalent</li>
<li><strong>DTP</strong> — <em>Dynamic Trunking Protocol</em>, Cisco. Negotiates whether a link becomes a trunk. I'd disable it, because a host that speaks DTP can talk a port into becoming a trunk and then see every VLAN — that's VLAN hopping</li>
<li><strong>VTP</strong> — <em>VLAN Trunking Protocol</em>, Cisco. Syncs the VLAN list between switches. It's risky because a switch with a higher revision number can overwrite every VLAN in the domain, so most people run it in transparent mode</li>
<li><strong>UDLD</strong> — <em>UniDirectional Link Detection</em>. Catches a fiber that only works in one direction, which is dangerous because a blocked STP port stops hearing BPDUs, assumes the path is gone, and starts forwarding — creating the exact loop STP was preventing</li>
</ul>
<p>And then the protection family on access ports: <strong>port security</strong>, <strong>BPDU guard</strong>, <strong>root guard</strong>, <strong>DHCP snooping</strong> and <strong>dynamic ARP inspection</strong>. Their common purpose is stopping an untrusted port from lying to the network.</p>` },
      { d: 'medium', q: 'How would you lock down a switchport that faces a user desk?',
        a: `<p>Start from the assumption that whatever gets plugged in there might be hostile or just wrong:</p>
<ul>
<li><strong>Access mode, negotiation off</strong> — <code>switchport mode access</code> and <code>switchport nonegotiate</code>, so nobody can turn it into a trunk and reach other VLANs</li>
<li><strong>PortFast + BPDU Guard</strong> — the port goes straight to forwarding for the user, but shuts itself down the moment a BPDU arrives, which means somebody plugged in a switch</li>
<li><strong>Port security</strong> — cap how many MAC addresses the port may learn, so nobody can flood the address table and force the switch to broadcast everything</li>
<li><strong>DHCP snooping</strong> — mark only the uplink as trusted, so a home router plugged in backwards can't start handing out addresses</li>
<li><strong>Dynamic ARP Inspection</strong> — validate ARP replies against the DHCP snooping table, which kills ARP spoofing</li>
<li><strong>802.1X</strong> if the organisation has RADIUS — then the port carries no traffic at all until the device authenticates</li>
</ul>` },
      { d: 'medium', q: 'What is ICMP, and how does traceroute use it?',
        a: `<p><strong>ICMP</strong> is the <em>Internet Control Message Protocol</em>, IP protocol number 1. It carries no user data — it's the channel routers and hosts use to report problems. Ping is ICMP echo request and echo reply, types 8 and 0.</p>
<p>Traceroute is a trick built on <strong>TTL</strong>. It sends a packet with TTL set to 1; the first router decrements it to zero, drops it, and returns <strong>ICMP Time Exceeded</strong> — and that reply reveals the router's address. Then it sends TTL 2, which dies at the second router, and so on. Each round exposes one more hop in order. When it finally reaches the destination the reply is a different type, which is how it knows to stop.</p>
<p>Two things I'd add, because they're how traceroute gets misread: asterisks at a middle hop mean that router chose not to answer the probe, not that traffic stopped there. And blocking ICMP at a firewall also blocks Type 3 Code 4, "fragmentation needed", which is what Path MTU Discovery relies on — that's the cause of the classic "small requests work, large ones hang".</p>` },
      { d: 'medium', q: 'Draw an Ethernet frame and tell me what each field does.',
        a: `<p>Preamble and start frame delimiter for clock sync, then destination MAC, then source MAC. <strong>Destination comes first</strong> so a cut-through switch can start forwarding before the frame has finished arriving. Optionally a 4-byte 802.1Q tag carrying the VLAN ID and priority. Then EtherType, which says what protocol is in the payload — 0x0800 for IPv4, 0x0806 for ARP. Then the payload, 46 to 1500 bytes, padded if it's short. Then a 4-byte FCS, a CRC over the frame; if it doesn't match, the receiver silently drops the frame and increments an error counter.</p>
<p>Frame size is <strong>64 to 1518 bytes</strong>, and there's a 12-byte interframe gap after it.</p>` },
      { d: 'medium', q: "What's in an IP header, and what changes hop to hop?",
        a: `<p>Version and header length, DSCP for QoS, total length, then the identification, flags and fragment offset fields used for fragmentation. Then TTL, protocol number and header checksum, then source and destination addresses. Twenty bytes normally.</p>
<p>What changes at every hop is the <strong>TTL</strong>, decremented by one — and because of that the <strong>header checksum has to be recomputed</strong>. Source and destination IP stay the same end to end unless something performs NAT. The checksum covers only the header, not the payload, since the transport layer handles its own data integrity.</p>` },
      { d: 'easy', q: 'How does a switch build its MAC address table?',
        a: `<p>It reads the <strong>source MAC</strong> of every frame that arrives and records that address against the port it came in on, scoped to the VLAN. It never learns from the destination field.</p>
<p>When it needs to forward, it looks up the destination MAC: known → send out that one port; unknown → flood out every other port in the VLAN; broadcast or multicast → flood. If the destination is on the same port the frame arrived on, it <strong>filters</strong> the frame instead of forwarding. Entries age out after <strong>300 seconds</strong> so a device that moves doesn't get stuck with a stale entry.</p>` },
      { d: 'easy', q: "What's the difference between a MAC address table and an ARP table?",
        a: `<p>The <strong>MAC table</strong> lives on a switch and maps MAC addresses to physical ports, so it's a layer 2 structure. The <strong>ARP table</strong> lives on any IP host, including routers, and maps IP addresses to MAC addresses, so it bridges layer 3 to layer 2.</p>
<p>A switch consults its MAC table to decide which port to send a frame out of. A host consults its ARP table to decide what to write in the destination MAC field in the first place.</p>` },
      { d: 'medium', q: 'Why do we need spanning tree?',
        a: `<p>Because Ethernet frames have <strong>no TTL</strong>. If there's a physical loop, a broadcast frame circulates indefinitely and gets duplicated at every switch, so it multiplies exponentially and saturates the network within seconds. It also corrupts MAC tables, because the same source MAC keeps arriving on different ports.</p>
<p>STP blocks the redundant path so you get the redundancy of a second cable without the loop, and it unblocks that path automatically if the primary fails.</p>` },
      { d: 'medium', q: 'Walk me through how the root bridge is elected.',
        a: `<p>Every switch starts by claiming to be root and sends BPDUs every two seconds to a reserved multicast address. Each switch compares the bridge ID in received BPDUs against its own. The bridge ID is a priority value plus the switch's MAC address, so the <strong>lowest priority wins, and if priorities tie, the lowest MAC wins</strong>.</p>
<p>Because priority defaults to 32768 everywhere, the oldest switch in the building tends to win by accident — which is why you set the root manually on your core switch.</p>
<p>Once the root is chosen, every other switch picks one <strong>root port</strong> based on the lowest cumulative path cost back to root, each segment picks a <strong>designated port</strong>, and everything left over <strong>blocks</strong>.</p>` },
      { d: 'medium', q: 'A router receives a packet. What does it do with it?',
        a: `<p>It checks the destination MAC to confirm the frame is for it and verifies the FCS, then strips the Ethernet header. It validates the IP header checksum and checks the TTL — if the TTL has expired it drops the packet and returns <strong>ICMP Time Exceeded</strong>.</p>
<p>It looks up the destination address in the routing table and takes the <strong>longest prefix match</strong>. It decrements the TTL and recalculates the header checksum, because the header changed. It resolves the next hop's MAC address from its ARP cache, ARPing if necessary. Then it builds a new Ethernet header with its own outgoing interface MAC as source and the next hop's MAC as destination, and forwards.</p>` },
      { d: 'medium', q: 'When a packet crosses two routers, what changes and what stays the same?',
        a: `<p>The <strong>layer 2 addresses are rewritten at every hop</strong>, because they only have meaning on the local segment. The <strong>layer 3 addresses stay the same</strong> the whole way, because they identify the actual endpoints. The <strong>TTL decrements by one per router</strong>, and the header checksum is recalculated because of it.</p>
<p>NAT is the exception that rewrites the IP addresses, but that's a deliberate translation, not normal forwarding.</p>` },
      { d: 'medium', q: "What's the difference between distance vector and link state?",
        a: `<p>A <strong>distance vector</strong> protocol sends its entire routing table to its direct neighbors and trusts what they tell it. It knows the direction and the distance but has no picture of the topology, which is why it converges slowly and needs mechanisms like split horizon to avoid loops.</p>
<p>A <strong>link state</strong> protocol floods information about its own links to every router in the area, so every router builds an identical map of the topology and independently runs Dijkstra to compute its own shortest-path tree. That converges much faster and scales better, at the cost of more memory and CPU.</p>
<p>RIP is distance vector, OSPF is link state.</p>` },
      { d: 'medium', q: 'How does a router choose between two routes to the same place?',
        a: `<p><strong>Longest prefix match first.</strong> The most specific route wins regardless of which protocol supplied it, so a /24 beats a /16 even if the /24 came from RIP and the /16 was a static route.</p>
<p>Only when two routes have the <em>identical</em> prefix does <strong>administrative distance</strong> come in, which ranks how much the router trusts each source: connected 0, static 1, OSPF 110, RIP 120. If the prefix and the administrative distance both tie, it compares the protocol's own <strong>metric</strong>. If everything ties, it load balances across both paths.</p>` },
      { d: 'easy', q: "What's the difference between a collision domain and a broadcast domain?",
        a: `<p>A <strong>collision domain</strong> is a segment where two devices transmitting at once would interfere. Every switch port is its own collision domain, and with full duplex collisions don't happen at all.</p>
<p>A <strong>broadcast domain</strong> is the set of devices that receive each other's broadcast frames, which is one VLAN. A switch does <em>not</em> break up broadcast domains; only a layer 3 boundary does. So you separate broadcast domains with VLANs plus a router, or an SVI on a layer 3 switch.</p>` },
      { d: 'hard', q: "You said you don't have deep networking experience. What have you actually done?",
        a: `<p>I've spent my career on the application side of the network, which means I'm usually the person other teams call when they think the network is broken. I've configured WebLogic clusters where the nodes have to reach each other across subnets, debugged TLS between systems including keystores and certificate chains, worked through firewall rules to get an SAP integration talking to our PLM environment, and traced connectivity problems with <code>tcpdump</code> and socket state when a database listener stopped answering.</p>
<p>What that gave me is the discipline of <strong>proving where a problem lives</strong> instead of handing it to the next team. What I've been building deliberately over the past weeks is the layer below that, so I can reason about frame formats, switching and routing rather than treating the network as a black box.</p>` }
    ]
  },
  {
    id: 'net-q-scenarios',
    title: 'Scenario & Troubleshooting Q&A',
    desc: 'Open-ended questions where they are grading your method, not a single fact. Answer in two levels: the direct answer first, then stop.',
    questions: [
      { d: 'hard', q: '"The application is slow." The app team says it\'s the network. How do you prove or disprove that?',
        a: `<p>I'd first define <em>slow</em>: which users, which transactions, since when, and is it constant or bursty. Then I'd split the latency. <code>ping</code> and <code>mtr</code> to the server give me baseline RTT and loss on the path. If RTT is 2 ms with no loss and the transaction takes 8 seconds, the network isn't the problem — and I have data instead of an argument.</p>
<p>Then I'd break down where the time goes with <code>curl -w</code>, which separates DNS lookup, TCP connect, TLS handshake, and time-to-first-byte. If TTFB is the whole delay and connect time is 1 ms, it's server-side processing. If DNS is 3 seconds, it's a resolver problem.</p>
<p>If I need more, a packet capture on both ends shows retransmissions, zero-window advertisements, and where the delay actually sits. Retransmissions mean real network loss. A zero window means the receiving application isn't reading fast enough, which is again the app.</p>
<p>I've had this exact argument on PLM systems. It usually turns out to be a database query, a full GC pause, or an exhausted connection pool — but I don't assert that until the network data rules the network out.</p>` },
      { d: 'medium', q: 'Users can reach the server by IP but not by hostname. Walk me through it.',
        a: `<p>That's DNS by definition, since connectivity is proven. I'd check which resolver the client is actually using, then query that resolver directly with <code>dig @&lt;resolver&gt; hostname</code> to see whether the failure is the resolver or the client. I'd check the hosts file for a stale override, and the search domain if they're using a short name.</p>
<p>Then I'd check the authoritative server with <code>dig +trace</code> to see whether the record exists at all or whether the delegation is broken. If the record was recently changed, TTL caching explains partial failure. If only some users fail, they're probably pointed at a different resolver.</p>` },
      { d: 'medium', q: "Two hosts in the same VLAN can't ping each other. Steps?",
        a: `<p>Bottom up. Link status and interface errors on both switchports. Then confirm both ports are actually in the same VLAN and it's an access port, not a trunk with a mismatched native VLAN. Then confirm both hosts have IPs in the same subnet <strong>with the same mask</strong>, since a wrong mask makes one host think the other is remote.</p>
<p>Check the ARP table on both: if there's no ARP entry, it's L2. If ARP resolves but ping fails, it's a host firewall — common, because Windows blocks ICMP by default. I'd also check the switch's MAC table to confirm it's learning both MACs on the expected ports, and look for private VLAN or port-protection config isolating them.</p>` },
      { d: 'easy', q: 'Router vs L3 switch?',
        a: `<p>Both make L3 forwarding decisions. The <strong>L3 switch</strong> does it in hardware ASICs at line rate, has high Ethernet port density, and handles inter-VLAN routing inside a campus. The <strong>router</strong> forwards in software or on an NPU, has fewer ports but supports WAN interface types, and carries the heavier feature set: NAT, VPN termination, deep QoS, complex ACLs, and full BGP tables.</p>
<p>Use the L3 switch inside the building, the router at the edge.</p>` },
      { d: 'hard', q: 'Design a VLAN and subnet layout for a small factory site, 200 devices.',
        a: `<p>I'd segment by <strong>function and trust level</strong> rather than by physical location:</p>
<table class="net-table"><thead><tr><th>VLAN</th><th>Purpose</th><th>Subnet</th></tr></thead><tbody>
<tr><td>10</td><td>Office workstations</td><td>10.20.10.0/24</td></tr>
<tr><td>20</td><td>Voice</td><td>10.20.20.0/24</td></tr>
<tr><td>30</td><td>Production / OT equipment</td><td>10.20.30.0/24</td></tr>
<tr><td>40</td><td>Servers</td><td>10.20.40.0/24</td></tr>
<tr><td>50</td><td>Wireless guest</td><td>10.20.50.0/24</td></tr>
<tr><td>99</td><td>Management</td><td>10.20.99.0/24</td></tr>
</tbody></table>
<p>Each VLAN gets an SVI on the core L3 switch as its gateway. OT gets the tightest ACLs, since manufacturing equipment often runs unpatchable old software and should never reach the internet. Guest wireless is isolated to internet only. Management is reachable only from a jump host.</p>
<p>I'd use /24s even where a /27 would fit, because address space is free and renumbering later is not. Redundancy comes from dual uplinks with LACP, HSRP/VRRP for gateway failover, and RSTP with the root bridge pinned to the core.</p>` },
      { d: 'medium', q: "What's the difference between TCP CLOSE_WAIT and TIME_WAIT, and which one is your problem?",
        a: `<p><strong>TIME_WAIT</strong> is on the side that closed first, waiting 2×MSL so delayed duplicate packets don't land on a new connection reusing the same tuple. It's normal and self-clearing.</p>
<p><strong>CLOSE_WAIT</strong> means the peer sent FIN and my application never called close on the socket. That one is an application bug, usually an unclosed connection or stream, and it leaks file descriptors until the process dies.</p>
<p>So thousands of TIME_WAIT is usually fine; a growing count of CLOSE_WAIT means someone needs to fix code.</p>` },
      { d: 'hard', q: 'Users report the site is slow only over the VPN. Everything else is fine.',
        a: `<p>First suspect is <strong>MTU</strong>. IPsec adds around 50–60 bytes, so a full-size packet from the client exceeds the tunnel MTU. If a firewall along the path drops ICMP, Path MTU Discovery fails silently and you get the signature symptom: the handshake works, small requests work, large transfers hang.</p>
<p>I'd test with <code>ping -M do -s</code> at decreasing sizes to find the real path MTU, then either lower the tunnel interface MTU or clamp TCP MSS to about 1360.</p>
<p>If MTU checks out, I'd look at concentrator utilization, split tunneling sending everything through one head-end, and simple added RTT from backhauling traffic.</p>` },
      { d: 'easy', q: 'How does a switch know where to send a frame?',
        a: `<p>It reads the source MAC of every arriving frame and records that MAC against the ingress port in its CAM table. For each frame it looks up the destination MAC: known → forwards out that one port; unknown or broadcast → floods to every other port in the VLAN. Entries age out after 300 seconds.</p>
<p>If a MAC appears on two ports and keeps flapping, that's a loop — STP has failed or been disabled.</p>` },
      { d: 'easy', q: 'Why do you need spanning tree? (short version)',
        a: `<p>Ethernet frames have no TTL. A physical loop means a broadcast frame circulates forever and multiplies at every switch, so the network saturates within seconds and MAC tables become useless. STP blocks the redundant path and keeps it in standby, unblocking it if the primary fails. You get redundancy without the loop.</p>` },
      { d: 'medium', q: "What's the difference between a security group and a NACL?",
        a: `<p><strong>Security groups</strong> are stateful and apply to an instance, so return traffic for an allowed outbound connection is permitted automatically, and they only support allow rules.</p>
<p><strong>NACLs</strong> are stateless and apply to a whole subnet, support explicit deny, and are evaluated in rule-number order. Because they're stateless you have to allow the ephemeral port range inbound for return traffic — which is where most people get caught.</p>` },
      { d: 'hard', q: "You get a call: an entire office can't reach anything. Where do you start?",
        a: `<p><strong>Scope first.</strong> Everyone in the office, or one VLAN? Internet only, or internal too? If they can reach internal resources but not the internet, the WAN link, edge firewall, or default route is suspect. If nothing works at all, I'd look at the distribution or core uplink.</p>
<p>Then I'd check whether it's a power event, a spanning tree topology change, or a config change from the last maintenance window. I'd pull up interface counters and syslog on the core, look for link flaps and STP topology-change notifications with timestamps, and correlate against the change log. <strong>What changed is almost always the answer.</strong></p>` },
      { d: 'easy', q: 'Explain a subnet mask to a non-technical person.',
        a: `<p>It's the line that says which part of an address is the <em>neighborhood</em> and which part is the <em>house number</em>. Devices in the same neighborhood talk to each other directly. If the address is in a different neighborhood, the device hands the message to the gateway, which is the post office.</p>
<p>Get the mask wrong and a device thinks its neighbor lives across town, so it sends the message to the post office instead of walking next door — and the delivery fails.</p>` }
    ]
  },
  {
    id: 'net-q-subnetting',
    title: 'Subnetting Practice Set',
    desc: 'Ten problems with worked answers. Do them on paper, timed — this is the part of the interview that is pass/fail.',
    questions: [
      { d: 'easy', q: '192.168.20.200/27 — network, broadcast, usable range?',
        a: `<p>Block 32, boundaries 0/32/64/96/128/160/192/224. 200 falls in the 192 block.</p>
<p>Network <strong>192.168.20.192</strong>, broadcast <strong>192.168.20.223</strong>, usable <strong>.193 – .222</strong>.</p>` },
      { d: 'easy', q: 'How many usable hosts in a /22?',
        a: `<p>2^(32−22) − 2 = 1024 − 2 = <strong>1022</strong>.</p>` },
      { d: 'medium', q: '10.10.10.10/30 — is 10.10.10.9 a valid host on the same subnet?',
        a: `<p>Block 4, boundaries …8/12. The subnet is <strong>10.10.10.8/30</strong>: network .8, hosts .9 and .10, broadcast .11.</p>
<p>So <strong>yes</strong> — .9 is the other host on the link.</p>` },
      { d: 'medium', q: 'Third usable subnet of 172.20.0.0/16 when split into /19s?',
        a: `<p>/19 gives a block size of 32 in the third octet: 0, 32, 64…</p>
<p>The third subnet is <strong>172.20.64.0/19</strong>, range 172.20.64.1 – 172.20.95.254.</p>` },
      { d: 'medium', q: 'Can 192.168.5.62/26 and 192.168.5.65/26 talk without a router?',
        a: `<p><strong>No.</strong> The /26 block is 64. .62 is in 192.168.5.0/26 (0–63); .65 is in 192.168.5.64/26 (64–127). Different subnets — they need a router.</p>` },
      { d: 'easy', q: 'Smallest subnet for exactly 12 hosts?',
        a: `<p>12 hosts needs 14 usable → <strong>/28</strong> (16 addresses, 14 usable).</p>` },
      { d: 'medium', q: 'Broadcast address of 10.4.7.200/21?',
        a: `<p>/21 gives a block of 8 in the third octet: 0/8/16… The value 7 falls in the 0 block, so the network is 10.4.0.0/21.</p>
<p>Broadcast is <strong>10.4.7.255</strong>.</p>` },
      { d: 'medium', q: '172.31.255.255/12 — valid host address or broadcast?',
        a: `<p>The /12 spans 172.16.0.0 to 172.31.255.255, so this is the <strong>broadcast address</strong> — not usable as a host.</p>` },
      { d: 'medium', q: 'Summarize 192.168.4.0/24, 192.168.5.0/24, 192.168.6.0/24 and 192.168.7.0/24 into one prefix.',
        a: `<p><strong>192.168.4.0/22</strong> — four consecutive /24s starting on a multiple of 4.</p>` },
      { d: 'medium', q: 'A host has 10.1.1.65/26 with gateway 10.1.1.1. Will it work?',
        a: `<p><strong>No.</strong> 10.1.1.65/26 lives in 10.1.1.64/26 (64–127). The gateway 10.1.1.1 is in 10.1.1.0/26. The host will ARP for a gateway that isn't on its subnet and get nothing back.</p>` }
    ]
  }
];

/**
 * 60-second recall drill. Grouped flashcards — the answer column stays covered
 * until the card is clicked, so it works the same way as covering the page.
 */
const networkingDrill = [
  {
    id: 'drill-frames',
    title: 'Frames & Switching',
    items: [
      { p: 'Ethernet frame size range', a: '64 to 1518 bytes (1522 with a VLAN tag)' },
      { p: 'EtherType for IPv4 / ARP', a: '0x0800 / 0x0806' },
      { p: 'FCS covers', a: 'The whole frame, CRC32' },
      { p: 'First 24 bits of a MAC', a: 'OUI — the vendor' },
      { p: 'Switch learns from', a: 'Source MAC of arriving frames' },
      { p: 'MAC aging default', a: '300 seconds' },
      { p: 'Unknown destination MAC', a: 'Flood within the VLAN' },
      { p: '802.1Q is', a: 'VLAN tagging on trunks' },
      { p: 'LACP standard', a: '802.3ad' },
      { p: 'ARP resolves', a: 'IP → MAC, local segment only' },
      { p: 'LLDP is', a: 'Link Layer Discovery Protocol, 802.1AB — who is plugged in where (CDP is Cisco\'s)' },
      { p: 'DTP risk', a: 'A host can talk a port into becoming a trunk — VLAN hopping. Turn it off' },
      { p: 'VTP risk', a: 'A higher revision number overwrites every switch\'s VLAN list' },
      { p: 'DHCP snooping stops', a: 'A rogue DHCP server, and builds the IP↔MAC↔port binding table' },
      { p: 'Dynamic ARP Inspection stops', a: 'ARP spoofing, by checking replies against that binding table' }
    ]
  },
  {
    id: 'drill-stp',
    title: 'Spanning Tree',
    items: [
      { p: 'STP purpose', a: 'Prevent L2 loops — Ethernet has no TTL' },
      { p: 'BPDU destination', a: '01:80:C2:00:00:00' },
      { p: 'Bridge ID =', a: 'Priority + extended system ID + MAC' },
      { p: 'STP timers', a: 'Hello 2 s, forward delay 15 s, max age 20 s' },
      { p: '802.1D convergence', a: '30 to 50 seconds' },
      { p: 'RSTP standard', a: '802.1w' },
      { p: 'RSTP port states', a: 'Discarding, learning, forwarding' },
      { p: 'STP path cost for 1 Gbps', a: '4' },
      { p: 'UDLD catches', a: 'A fiber working one direction only — STP would unblock and loop' },
      { p: 'BPDU Guard does', a: 'Err-disables a PortFast port that receives a BPDU (someone plugged in a switch)' }
    ]
  },
  {
    id: 'drill-ip',
    title: 'IP & Routing',
    items: [
      { p: 'IP header size', a: '20 bytes, up to 60 with options' },
      { p: 'Protocol numbers 1 / 6 / 17 / 89', a: 'ICMP / TCP / UDP / OSPF' },
      { p: 'Why recompute the IP checksum', a: 'TTL changed at this hop' },
      { p: 'TTL hits 0', a: 'Drop, send ICMP Time Exceeded' },
      { p: 'Across a router hop, what changes', a: 'MACs and TTL. IPs do not' },
      { p: 'Routing table tiebreaker order', a: 'Longest prefix → AD → metric' },
      { p: 'OSPF administrative distance', a: '110' },
      { p: 'Static route AD', a: '1' },
      { p: 'OSPF metric', a: 'Cost = reference bandwidth / link bandwidth' },
      { p: 'OSPF full adjacency state', a: 'Full' },
      { p: 'Distance vector vs link state', a: "Neighbors' tables vs full topology map" },
      { p: 'BGP port / transport', a: 'TCP 179' },
      { p: 'ICMP is', a: 'Internet Control Message Protocol — the error and diagnostics channel, IP protocol 1' },
      { p: 'ICMP types 8 / 0', a: 'Echo request / echo reply — that pair is ping' },
      { p: 'ICMP type 11', a: 'Time Exceeded — TTL hit 0. What traceroute reads' },
      { p: 'ICMP type 3 code 4', a: 'Fragmentation needed but DF set — what PMTUD depends on' },
      { p: 'RIB vs FIB', a: 'Routing table in software vs the hardware copy that forwards packets' }
    ]
  },
  {
    id: 'drill-addressing',
    title: 'Addressing & Subnetting',
    items: [
      { p: 'Usable hosts in /26', a: '62' },
      { p: 'Mask for /27', a: '255.255.255.224' },
      { p: 'Block size for /28', a: '16' },
      { p: 'Private ranges', a: '10/8, 172.16/12, 192.168/16' },
      { p: '169.254.x.x means', a: 'No DHCP response (APIPA)' },
      { p: 'IPv6 standard subnet', a: '/64' },
      { p: 'DHCP steps', a: 'Discover, Offer, Request, Ack' }
    ]
  },
  {
    id: 'drill-transport',
    title: 'Transport, TLS & Ports',
    items: [
      { p: 'Default MTU / MSS', a: '1500 / 1460' },
      { p: 'CLOSE_WAIT means', a: "App didn't close the socket" },
      { p: 'TIME_WAIT means', a: 'We closed first, waiting 2×MSL' },
      { p: 'SNI is for', a: 'Choosing the right cert on a shared IP' },
      { p: 'Keystore vs truststore', a: 'My identity vs who I trust' },
      { p: 'Security group vs NACL', a: 'Stateful + instance vs stateless + subnet' },
      { p: 'Oracle listener port', a: '1521' },
      { p: 'WebLogic admin port', a: '7001' },
      { p: 'LDAPS port', a: '636' }
    ]
  }
];
