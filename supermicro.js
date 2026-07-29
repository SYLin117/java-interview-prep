// Supermicro System Engineer interview prep — technical Q&A grounded in what
// Supermicro actually asks (Glassdoor/interview reports) and what their System
// Engineer job postings require: server architecture, BMC/IPMI/Redfish,
// Linux/Windows Server, storage & RAID (FIO/IOMeter benchmarks), networking,
// and scripting. Loaded as a classic <script src="supermicro.js"></script>
// before the inline renderer in index.html; `supermicro` becomes available in
// the shared realm.
//
// Each entry is one topic section: { id, title, desc, questions: [{ d, q, a }] }.
// `d` is easy | medium | hard; `a` is HTML rendered via innerHTML — escape
// literal angle brackets as &lt; / &gt;.

const supermicro = [
  {
    id: 'smci-server-arch',
    title: 'Server & Hardware Architecture',
    desc: 'The core of the role — interviewers reportedly open with "explain how a server works" and drill into whatever you touch.',
    questions: [
      {
        d: 'easy',
        q: 'Walk me through what happens when a server is powered on, from power button to OS login.',
        a: `<strong>Know this cold — it's the classic opener.</strong><ul><li><strong>Standby power → BMC boots first.</strong> The BMC (a small ARM SoC) runs on standby power and is already up before the host powers on — this is why you can reach the IPMI web page of a "powered off" server.</li><li><strong>Power-on: PSU good signal</strong> → CPU comes out of reset and executes firmware (BIOS/UEFI) from SPI flash.</li><li><strong>POST</strong> — firmware initializes and tests CPU, memory (DIMM training), chipset, and enumerates PCIe devices; errors surface as beep codes / POST codes / BMC event-log entries.</li><li><strong>Boot device selection</strong> — UEFI reads the boot order, loads the bootloader (e.g. GRUB) from the EFI System Partition.</li><li><strong>Kernel + init</strong> — bootloader loads the OS kernel and initramfs; kernel initializes drivers, mounts root, hands off to <code>systemd</code>, which starts services up to the login target.</li></ul>Being able to say <em>where</em> a boot hang lives (no power vs. no POST vs. no boot device vs. kernel panic) is exactly the debugging instinct they probe.`
      },
      {
        d: 'easy',
        q: 'What is the difference between BIOS and UEFI?',
        a: `<strong>BIOS</strong> is the legacy 16-bit firmware: boots via the MBR (max 2 TB disks, 4 primary partitions), limited pre-boot environment.<br><br><strong>UEFI</strong> is its modern replacement: 32/64-bit, boots from GPT disks (huge capacities, many partitions), has a real pre-boot environment with drivers, a shell, and network stack (PXE/HTTP boot), supports <strong>Secure Boot</strong> (cryptographic verification of the bootloader chain), and stores boot entries in NVRAM instead of relying on boot-sector code. Modern Supermicro boards are UEFI with an optional legacy CSM mode. In practice you'll toggle UEFI vs Legacy when an old OS installer or RAID option ROM misbehaves — worth mentioning you've done that.`
      },
      {
        d: 'medium',
        q: 'Explain ECC memory, memory channels, and DIMM population rules. Why do they matter in servers?',
        a: `<strong>ECC (Error-Correcting Code)</strong> DIMMs store extra check bits so the memory controller can correct single-bit errors and detect multi-bit ones — essential at server scale where cosmic-ray bit flips are a statistical certainty. Correctable errors are logged (a rising rate on one DIMM predicts failure — check the BMC SEL); uncorrectable ones typically halt the system.<br><br><strong>Channels:</strong> each CPU has multiple independent memory channels (8-12 on modern Xeon/EPYC). Bandwidth scales with populated channels, so one giant DIMM on one channel starves the CPU — you populate <em>one DIMM per channel first</em>, balanced across channels, following the motherboard's population matrix.<br><br><strong>Why interviewers care:</strong> a huge fraction of real field issues are memory — wrong population order, mixed DIMM types, or a flaky slot — and the fix starts with reading the SEL and the population guide, not swapping parts blindly.`
      },
      {
        d: 'medium',
        q: 'What are PCIe lanes and generations? How would you explain a device running slower than expected?',
        a: `PCIe is a point-to-point serial link built from <strong>lanes</strong> (x1/x4/x8/x16); bandwidth ≈ lanes × per-lane speed, and each <strong>generation doubles</strong> the per-lane rate (Gen3 ~1 GB/s, Gen4 ~2 GB/s, Gen5 ~4 GB/s per lane per direction). CPUs expose a fixed lane budget, so slots can be physically x16 but electrically x8, or share lanes with NVMe/other slots (bifurcation).<br><br><strong>Slow device triage:</strong> check the <em>negotiated</em> width/speed vs. the card's capability — <code>lspci -vv</code> shows <code>LnkCap</code> (capable) vs <code>LnkSta</code> (actual). A Gen4 x16 GPU negotiating Gen1 x4 points at a riser/slot issue, wrong slot choice, bifurcation config, or a marginal connector. Also confirm the slot's lanes come from the CPU and not the chipset (which shares an uplink). This exact "why is my NIC/GPU slow" walkthrough is a very plausible interview scenario.`
      },
      {
        d: 'medium',
        q: 'What is NUMA and why does it matter for performance on multi-socket servers?',
        a: `On a multi-socket (or chiplet) server, each CPU has its own directly-attached memory; accessing the <em>other</em> socket's memory crosses the inter-socket link (UPI/Infinity Fabric) with higher latency and lower bandwidth. That asymmetry is <strong>NUMA — Non-Uniform Memory Access</strong>.<br><br>The OS exposes NUMA nodes (<code>lscpu</code>, <code>numactl --hardware</code>); well-behaved software allocates memory on the node where its threads run. Symptoms of getting it wrong: a benchmark that mysteriously loses 20-40% when threads migrate, or a NIC/GPU on socket 0's PCIe lanes being driven by threads on socket 1. Fixes: pin with <code>numactl</code>/<code>taskset</code>, enable sub-NUMA clustering deliberately, and keep a device's interrupts + threads local to its socket. Mentioning NUMA when discussing benchmarking (FIO, iperf) is an easy way to sound senior.`
      },
      {
        d: 'hard',
        q: 'What is special about GPU servers (like Supermicro\'s HGX systems) compared to standard 2U servers?',
        a: `Supermicro's growth is AI systems, so expect this if the team touches GPU products.<ul><li><strong>Power & cooling:</strong> 8× H100/B200-class GPUs mean 6-10+ kW per node — high-CFM shared fans, shrouded airflow zones, and increasingly <strong>direct liquid cooling (DLC)</strong> with cold plates and CDUs; Supermicro sells full liquid-cooled racks.</li><li><strong>GPU interconnect:</strong> inside a node, GPUs talk over <strong>NVLink/NVSwitch</strong> (way faster than PCIe) on HGX baseboards; across nodes, RDMA networking (InfiniBand or RoCE) at 400G+, often one NIC per GPU.</li><li><strong>Topology matters:</strong> GPU↔NIC↔CPU affinity (which PCIe switch, which NUMA node) directly moves training throughput; <code>nvidia-smi topo -m</code> is the tool.</li><li><strong>Validation angle:</strong> burn-in with <code>gpu-burn</code>/NCCL all-reduce tests, watching thermals and per-GPU clocks for throttling — a system engineer's daily bread in this product line.</li></ul>`
      }
    ]
  },
  {
    id: 'smci-bmc',
    title: 'BMC & Remote Management (IPMI / Redfish)',
    desc: 'Out-of-band management is Supermicro\'s home turf — their JDs name BMC/OOB explicitly and firmware teams live in this stack.',
    questions: [
      {
        d: 'easy',
        q: 'What is a BMC and what can you do with it?',
        a: `The <strong>Baseboard Management Controller</strong> is an independent microcontroller on the motherboard (Supermicro uses ASPEED AST2xxx parts) with its own firmware, network port, and standby power. It manages the host <em>out-of-band</em> — no OS, or even a powered-on host, required.<br><br>With it you can: power on/off/reset the host, watch sensors (temperatures, fan RPM, voltages), read the <strong>SEL</strong> (System Event Log), take a remote <strong>KVM console</strong> (screen/keyboard in the browser, including into the BIOS), mount virtual media to install an OS remotely, update BIOS/BMC firmware, and get alerts. On Supermicro boards the web UI + IPMI + Redfish all front the same BMC. If you've ever fixed a server you couldn't walk up to, tell that story here.`
      },
      {
        d: 'easy',
        q: 'What is IPMI? Give some ipmitool commands you actually use.',
        a: `<strong>IPMI</strong> (Intelligent Platform Management Interface) is the classic standard protocol for talking to a BMC — locally via the kernel driver, or over the network on UDP 623 (RMCP+).<br><br>Everyday <code>ipmitool</code>:<div class="ex-label">Example</div><pre><code># remote: -I lanplus -H &lt;bmc-ip&gt; -U &lt;user&gt; -P &lt;pass&gt;
ipmitool chassis status          # power state
ipmitool chassis power on|off|cycle
ipmitool sel elist               # system event log — first stop for hardware faults
ipmitool sensor list             # temps, fans, voltages with thresholds
ipmitool sol activate            # serial-over-LAN console
ipmitool chassis identify 60     # blink the ID LED to find the box in a rack</code></pre>Knowing that SEL + sensors are the <em>first</em> diagnostic stop for "server died overnight" is the point being tested.`
      },
      {
        d: 'medium',
        q: 'IPMI vs Redfish — what\'s the difference and why is the industry moving to Redfish?',
        a: `<strong>IPMI</strong>: 1990s design, binary protocol over UDP 623, flat command set, weak crypto (RAKP flaws; the famous "cipher 0" hole), poor extensibility.<br><br><strong>Redfish</strong> (DMTF): modern replacement — a <strong>RESTful HTTPS/JSON API</strong> with a discoverable schema-backed resource tree (<code>/redfish/v1/Systems</code>, <code>/Chassis</code>, <code>/Managers</code>), normal TLS + session/role security, eventing via subscriptions, and clean vendor extension points. It's automation-friendly: <code>curl</code> + JSON instead of raw binary, so it slots into Ansible/Python fleet tooling.<div class="ex-label">Example</div><pre><code>curl -k -u admin:pass https://&lt;bmc&gt;/redfish/v1/Systems/1 | jq .PowerState
# power on:
curl -k -u admin:pass -X POST \\
  https://&lt;bmc&gt;/redfish/v1/Systems/1/Actions/ComputerSystem.Reset \\
  -H 'Content-Type: application/json' -d '{"ResetType":"On"}'</code></pre>Supermicro BMCs ship both; new tooling targets Redfish, IPMI remains for legacy. Their firmware JDs list Redfish by name.`
      },
      {
        d: 'medium',
        q: 'What does out-of-band (OOB) vs in-band management mean?',
        a: `<strong>In-band</strong>: managing the server through its own OS — SSH, an agent, SNMP daemon. Works only while the host is up, healthy, and on the network.<br><br><strong>Out-of-band</strong>: managing through the BMC's separate path — dedicated management NIC (or a shared-LAN sideband mode), independent power, independent firmware. Works when the host is powered off, has no OS, kernel-panicked, or lost its NIC config.<br><br>Real-world framing: data centers put BMCs on an isolated management VLAN (IPMI's security history makes exposing it publicly a cardinal sin), and OOB is how you recover a box you bricked with a bad network change — power-cycle + KVM in, no drive to the data center. A story like that lands well.`
      },
      {
        d: 'hard',
        q: 'A server powered off overnight by itself. How do you investigate via the BMC?',
        a: `Structured answer they're fishing for:<ul><li><strong>Read the SEL first</strong> (<code>ipmitool sel elist</code>): look for over-temperature assertions, PSU failure/AC-lost events, watchdog resets, or an explicit "power off" command (which would implicate software/humans, not hardware).</li><li><strong>Check sensors</strong> against thresholds — inlet temp, CPU temps, fan RPMs (a dead fan → thermal trip), PSU status and input voltage.</li><li><strong>Correlate timelines:</strong> SEL timestamps vs. facility events (PDU/UPS logs) vs. OS logs (<code>last</code>, <code>journalctl -b -1</code>) — clean OS shutdown means software; abrupt stop plus AC-lost event means power chain.</li><li><strong>Thermal trip specifically:</strong> BMC logs "CPU Thermtrip" or "TempOS shutdown" — then check airflow (blocked filters, failed fans, shroud missing) before blaming the CPU.</li><li><strong>If PSU suspected:</strong> redundant PSU status LEDs/SEL entries identify which unit; reseat/swap and watch.</li></ul>The meta-skill being tested: evidence from logs before parts-swapping.`
      }
    ]
  },
  {
    id: 'smci-linux',
    title: 'Linux & OS Fundamentals',
    desc: 'JDs ask for RHEL/Ubuntu/Windows Server configuration experience; interviews probe hands-on command-line fluency.',
    questions: [
      {
        d: 'easy',
        q: 'You\'re handed an unknown Linux server. What commands do you run to inventory its hardware?',
        a: `<div class="ex-label">Example</div><pre><code>lscpu                  # CPU model, sockets, cores, NUMA nodes
free -h                # memory total/used
dmidecode -t memory    # per-DIMM: size, speed, slot, part number
lspci                  # PCIe devices: NICs, GPUs, RAID/HBA controllers
lsblk                  # disks and partitions
nvme list              # NVMe drives with model + firmware
ip a                   # interfaces and addresses
dmesg | less           # kernel log: errors during boot, link training, etc.
dmidecode -t system    # chassis model / serial (yes, it shows Supermicro)</code></pre><code>dmidecode</code> reads the SMBIOS tables the BIOS populates — mentioning that link between firmware and OS-visible inventory is a nice touch.`
      },
      {
        d: 'easy',
        q: 'How do you check why a service failed and manage it with systemd?',
        a: `<div class="ex-label">Example</div><pre><code>systemctl status nginx        # state, last exit code, recent log lines
journalctl -u nginx -e        # full unit log, jump to end
journalctl -b -p err          # all errors since boot
systemctl restart nginx
systemctl enable --now nginx  # start now + auto-start at boot
systemctl list-units --failed # anything else broken?</code></pre>Escalation path: unit status → its journal → config test (e.g. <code>nginx -t</code>) → dependencies (<code>systemctl list-dependencies</code>). Being fluent here signals you actually run Linux boxes rather than just reading about them.`
      },
      {
        d: 'medium',
        q: 'A server is "slow". Walk through your performance triage.',
        a: `Name the four resources and a tool for each — that's the structure they want:<ul><li><strong>CPU:</strong> <code>top</code>/<code>htop</code> — user vs system vs <strong>iowait</strong>; load average vs core count; any one core pegged (single-threaded bottleneck)?</li><li><strong>Memory:</strong> <code>free -h</code>, <code>vmstat 1</code> — swapping (si/so columns) is the classic silent killer.</li><li><strong>Disk:</strong> <code>iostat -x 1</code> — %util near 100 and high await → storage bound; find the offender with <code>iotop</code>.</li><li><strong>Network:</strong> <code>ss -s</code>, <code>ip -s link</code> (drops/errors), <code>iperf3</code> to isolate path vs application.</li></ul>Then correlate: high iowait + one saturated disk → move load or fix the array; high system CPU + many interrupts → check IRQ affinity (NUMA again). Close with "and I'd check <code>dmesg</code>/SEL for hardware errors — thermal throttling or a failing drive masquerades as 'slow'."`
      },
      {
        d: 'medium',
        q: 'How would you install an OS on 50 servers efficiently?',
        a: `Not one USB stick 50 times — the expected answer is <strong>network boot + unattended install</strong>:<ul><li><strong>PXE boot:</strong> servers DHCP → get a TFTP/HTTP boot image; UEFI HTTP boot is the modern variant.</li><li><strong>Unattended config:</strong> Kickstart (RHEL), preseed (Debian/Ubuntu), or autoinstall/cloud-init — disk layout, packages, users, network all scripted.</li><li><strong>Per-node identity</strong> keyed off MAC/serial; post-install config via Ansible.</li><li><strong>The BMC shortcut:</strong> for smaller batches, script IPMI/Redfish virtual-media mount of an ISO + set boot device + power cycle — no PXE infrastructure needed. Supermicro also sells SUM/SCM tooling for exactly this.</li></ul>Bonus: firmware consistency first (same BIOS/BMC versions across the fleet) — version drift causes "identical" servers to behave differently, a very system-engineer insight.`
      },
      {
        d: 'medium',
        q: 'What is the difference between a process and a thread? What about kernel space vs user space?',
        a: `<strong>Process:</strong> an independent program instance with its own virtual address space, file descriptors, and credentials. <strong>Thread:</strong> an execution stream <em>inside</em> a process — shares the address space and resources, has its own stack and registers. Threads are cheaper to create/switch and share memory naturally (which is also why they can corrupt each other's data — locking).<br><br><strong>User space vs kernel space:</strong> user code runs unprivileged and touches hardware only through <strong>system calls</strong> (read/write/ioctl…) that trap into the kernel, which owns drivers, memory management, and scheduling. That boundary is why a crashed app doesn't take the machine down but a buggy driver can — and why device work (e.g. talking to a RAID controller) means kernel modules, <code>dmesg</code>, and <code>modprobe</code> rather than app-level debugging.`
      },
      {
        d: 'hard',
        q: 'The kernel log shows "Hardware Error" / MCE entries. What are they and what do you do?',
        a: `<strong>MCE (Machine Check Exception)</strong> entries are the CPU reporting hardware faults — memory ECC errors, cache errors, bus/interconnect faults. On Linux they surface in <code>dmesg</code> and via <code>mcelog</code>/<code>rasdaemon</code>, which decode which DIMM/CPU/bank is implicated.<br><br>Playbook:<ul><li><strong>Corrected errors:</strong> not fatal, but count and localize them — <code>rasdaemon</code> (<code>ras-mc-ctl --errors</code>) maps to a DIMM slot. A steady trickle from one DIMM → schedule replacement before it becomes uncorrectable.</li><li><strong>Uncorrected:</strong> the crash/panic already happened; use the logged address/bank plus the BMC SEL to identify the part.</li><li><strong>Cross-check the SEL</strong> — BMC and OS see the same events from different sides; agreement pins the slot.</li><li><strong>Then:</strong> reseat/swap the DIMM, re-run a memory test (memtest86+ or <code>stressapptest</code>), and watch the counters. If errors follow the DIMM → RMA it; if they stay with the slot → board/CPU socket issue.</li></ul>`
      }
    ]
  },
  {
    id: 'smci-storage',
    title: 'Storage & RAID',
    desc: 'Their JD names storage protocols (NAS/SMB/SAN/S3), devices (HDD/NVMe), and benchmarks (FIO/IOMeter/VDbench) explicitly.',
    questions: [
      {
        d: 'easy',
        q: 'Explain RAID 0, 1, 5, 6, and 10 — and when you\'d pick each.',
        a: `<ul><li><strong>RAID 0 (stripe):</strong> capacity + speed of all disks, <em>zero</em> redundancy — one death kills the array. Scratch/temp data only.</li><li><strong>RAID 1 (mirror):</strong> two copies; lose one disk, keep running. Boot drives.</li><li><strong>RAID 5 (stripe + 1 parity):</strong> survives one disk; capacity n−1. Weakness: long rebuilds on huge drives risk a second failure — increasingly avoided for big HDDs.</li><li><strong>RAID 6 (2 parity):</strong> survives two disks; capacity n−2; the default for large HDD arrays because of that rebuild window.</li><li><strong>RAID 10 (mirror pairs, striped):</strong> best write performance + fast rebuilds, costs 50% capacity. Databases.</li></ul>Two senior notes: RAID protects against <em>disk failure</em>, not deletion/ransomware — it is not backup; and the "write hole"/write penalty of parity RAID (read-modify-write) is why random-write-heavy workloads prefer RAID 10.`
      },
      {
        d: 'easy',
        q: 'SATA vs SAS vs NVMe — compare them.',
        a: `<ul><li><strong>SATA:</strong> 6 Gb/s, single queue (AHCI), cheapest; capacity HDDs and entry SSDs.</li><li><strong>SAS:</strong> 12/24 Gb/s, dual-ported (two paths → HA), deeper queues, expanders let one HBA address hundreds of drives — the enterprise HDD/JBOD backbone.</li><li><strong>NVMe:</strong> protocol designed for flash, rides <strong>PCIe directly</strong> (no HBA in the path) — a Gen4 x4 drive does ~7 GB/s and ~1M IOPS with thousands of parallel queues, vs SATA's ~550 MB/s.</li></ul>Form factors worth naming: 2.5" <strong>U.2</strong>, <strong>M.2</strong> sticks, and <strong>E1.S/E3.S (EDSFF)</strong> — the ruler formats Supermicro's all-flash storage servers are built around. Latency: NVMe ~10-20 µs vs SATA SSD ~70-100 µs vs HDD ~ms — three orders of magnitude HDD→flash.`
      },
      {
        d: 'medium',
        q: 'Hardware RAID vs software RAID (mdadm/ZFS) — trade-offs?',
        a: `<strong>Hardware RAID</strong> (Broadcom/MegaRAID cards): dedicated processor + battery/flash-backed write cache (fast, safe write-back), OS-independent, boot support, but a proprietary black box — a dead card can mean finding the same model to read your array, and it hides SMART from the OS.<br><br><strong>Software RAID</strong>: <code>mdadm</code> is transparent and portable (any Linux box can assemble the array); <strong>ZFS</strong> adds end-to-end checksums (detects <em>silent</em> corruption parity RAID misses), snapshots, and self-healing scrubs. Costs host CPU and needs care around write caches/power loss (hence ZFS's intent log).<br><br><strong>Current direction:</strong> NVMe made classic RAID cards awkward (they bottleneck PCIe drives), so modern designs lean software (ZFS, distributed storage like Ceph/WEKA — both of which Supermicro ships solutions for) or NVMe-aware accelerators (GRAID). For a boot mirror: mdadm/onboard is fine.<div class="ex-label">Example</div><pre><code>cat /proc/mdstat                     # array health at a glance
mdadm --detail /dev/md0              # members, state, rebuild progress
zpool status                         # ZFS: pool health + scrub results</code></pre>`
      },
      {
        d: 'medium',
        q: 'What are NAS, SAN, and object storage (S3)? Where does each fit?',
        a: `<ul><li><strong>NAS — file storage:</strong> the server exports a filesystem over <strong>NFS</strong> (Linux) or <strong>SMB</strong> (Windows); clients see shared folders. Home directories, media, shared project data.</li><li><strong>SAN — block storage:</strong> the array exports raw block devices over <strong>iSCSI</strong>, <strong>Fibre Channel</strong>, or <strong>NVMe-oF</strong>; the client formats its own filesystem. Databases, VM datastores — anything wanting exclusive low-latency block access.</li><li><strong>Object — S3 API:</strong> flat buckets of objects over HTTPS with rich metadata; no in-place edits, effectively unlimited scale. Backups, data lakes, AI training corpora; on-prem via MinIO/Ceph RGW (both run on Supermicro storage boxes).</li></ul>One-liner that shows you get it: <em>block is a disk, file is a folder, object is a warehouse with barcodes</em> — and NVMe-oF is why SAN latency now rivals local flash.`
      },
      {
        d: 'medium',
        q: 'How do you benchmark storage with FIO, and what mistakes invalidate the numbers?',
        a: `<strong>FIO</strong> drives configurable I/O patterns; the JD names it, so know the knobs: block size, read/write mix, random vs sequential, queue depth (<code>iodepth</code>), jobs, direct I/O.<div class="ex-label">Example</div><pre><code>fio --name=randread --filename=/dev/nvme0n1 --direct=1 \\
    --rw=randread --bs=4k --iodepth=32 --numjobs=4 \\
    --time_based --runtime=120 --group_reporting</code></pre>Standard corners: 4K random read / 4K random write (IOPS + latency), 128K-1M sequential (throughput).<br><br><strong>Classic mistakes:</strong><ul><li>Forgetting <code>--direct=1</code> → you benchmarked the page cache, not the drive.</li><li>No SSD <strong>preconditioning</strong> — fresh-out-of-box flash reads great until the garbage collector kicks in; write the device fully first and use <code>--time_based</code> steady state.</li><li>Testing through a filesystem when you meant the raw device (or vice versa — test what production uses).</li><li>QD1 numbers quoted as "the drive's IOPS" (NVMe shines at high queue depth; QD1 measures latency).</li><li>Ignoring <strong>latency percentiles</strong> — p99 matters more than the average.</li></ul>`
      },
      {
        d: 'hard',
        q: 'A drive in a RAID array failed in the field. Describe the replacement procedure and the risks.',
        a: `<ul><li><strong>Identify precisely:</strong> controller/OS event (SEL, <code>mdadm --detail</code>, <code>storcli</code>) → map to a physical slot; blink the drive LED (<code>storcli /c0/e&lt;E&gt;/s&lt;S&gt; start locate</code>, or <code>ledctl</code>). Pulling the <em>wrong</em> drive from a degraded RAID 5 destroys the array — this is the risk they want you to name.</li><li><strong>Check array state first:</strong> degraded-but-online vs already failed; confirm a current backup exists before touching anything.</li><li><strong>Replace:</strong> hot-swap the failed drive (matching or larger, same type), controller starts the rebuild — verify it actually did (<code>/proc/mdstat</code> progress, or controller UI).</li><li><strong>The dangerous window:</strong> rebuild hammers all surviving disks for hours; a second failure (or an unreadable sector — URE) on RAID 5 during rebuild = data loss. This is the argument for RAID 6 on big HDDs and for regular <strong>scrubs/patrol reads</strong> so latent bad sectors are found before, not during, a rebuild.</li><li><strong>Afterwards:</strong> RMA the dead drive per serial, note firmware version, and check whether that model is failing fleet-wide.</li></ul>`
      }
    ]
  },
  {
    id: 'smci-network',
    title: 'Networking Basics',
    desc: 'Enough networking to validate and troubleshoot server connectivity — plus the RDMA vocabulary their AI clusters run on.',
    questions: [
      {
        d: 'easy',
        q: 'A freshly racked server has no network. Walk through your troubleshooting.',
        a: `Bottom-up, out loud:<ul><li><strong>Layer 1:</strong> link LEDs; <code>ip link</code> — is the interface UP with a carrier? <code>ethtool eth0</code> — negotiated speed/duplex (a 100 Mb negotiation on a 25G port screams bad cable/transceiver). Swap cable/port to bisect.</li><li><strong>Layer 2:</strong> right switch port + VLAN? (The #1 real-world cause.) Check the switch's MAC table for our MAC.</li><li><strong>Layer 3:</strong> <code>ip a</code> — did DHCP give an address (or is static config right)? <code>ip route</code> — default gateway present? <code>ping</code> gateway → ping 8.8.8.8 → <code>ping google.com</code> (separates L3 from DNS).</li><li><strong>Also:</strong> is traffic going out the interface you think (<code>ip route get &lt;dst&gt;</code>)? Firewall (<code>nft list ruleset</code>)? And don't confuse the BMC port with a data NIC — a very Supermicro-specific gotcha since shared-LAN mode means one physical port can carry both.</li></ul>`
      },
      {
        d: 'easy',
        q: 'TCP vs UDP — differences and when each is used?',
        a: `<strong>TCP:</strong> connection-oriented, reliable, ordered, congestion-controlled — SSH, HTTPS, iSCSI, SMB… anything that can't lose bytes. Costs handshake latency and per-connection state.<br><br><strong>UDP:</strong> connectionless datagrams — no delivery/order guarantee, minimal overhead. DNS, DHCP, NTP, syslog, video/VoIP, and notably <strong>IPMI RMCP+ (UDP 623)</strong>.<br><br>Server-engineer color: "reliable" TCP still degrades — retransmissions from a marginal cable show up as throughput collapse while <code>ping</code> looks fine; <code>ss -ti</code> exposes retrans counters. And modern storage/AI fabrics sidestep both with RDMA for kernel-bypass latency.`
      },
      {
        d: 'medium',
        q: 'How do you verify a server\'s network throughput matches its NIC rating?',
        a: `<strong>iperf3</strong> between the server and a known-good peer:<div class="ex-label">Example</div><pre><code>iperf3 -s                        # on the reference machine
iperf3 -c &lt;server&gt; -t 30         # single TCP stream
iperf3 -c &lt;server&gt; -P 8 -t 30    # 8 parallel streams
iperf3 -c &lt;server&gt; -R            # reverse direction too</code></pre>Expect ~94% of line rate for TCP on a clean 10/25G path (protocol overhead). If it's low:<ul><li>One stream capped but 8 streams fine → single-flow limit (window size, one CPU core saturated with interrupts — check <code>ethtool -S</code> and IRQ affinity/RSS).</li><li>Both low → negotiated link speed (<code>ethtool</code>), errors/drops (<code>ip -s link</code>), MTU mismatch (jumbo frames configured on one side only — <code>ping -M do -s 8972</code> to test), or the NIC sitting in a starved PCIe slot (back to <code>lspci LnkSta</code>).</li></ul>That NIC-in-a-x1-slot case is a beloved interview trap: hardware placement explains a network symptom.`
      },
      {
        d: 'medium',
        q: 'What are VLANs and NIC bonding? How do servers typically use them?',
        a: `<strong>VLANs (802.1Q):</strong> tag Ethernet frames with an ID so one physical network carries isolated broadcast domains — e.g. prod traffic on VLAN 10, storage on 20, <strong>BMC/management on its own locked-down VLAN</strong> (standard practice given IPMI's security record). A server on a trunk port creates tagged sub-interfaces (<code>eth0.10</code>).<br><br><strong>Bonding/teaming:</strong> aggregate NICs for redundancy and/or bandwidth — <code>active-backup</code> (pure failover, no switch config needed) or <strong>802.3ad LACP</strong> (aggregation + failover, needs switch cooperation; one flow still rides one link — per-flow hashing). Typical build: two NICs, LACP to two MLAG'd switches → survives a NIC, cable, or entire switch dying. Config lives in netplan/NetworkManager/nmcli depending on distro — name whichever you've touched.`
      },
      {
        d: 'hard',
        q: 'What is RDMA (InfiniBand / RoCE) and why do AI clusters use it?',
        a: `<strong>RDMA</strong> — Remote Direct Memory Access — lets a NIC read/write another machine's memory directly, bypassing both kernels' network stacks: single-digit-µs latency, line-rate throughput, near-zero CPU. Two transports: native <strong>InfiniBand</strong> (own switches/ecosystem, dominant in AI pods) and <strong>RoCE v2</strong> (RDMA over converged Ethernet — needs a well-tuned lossless fabric: PFC/ECN).<br><br><strong>Why AI clusters:</strong> multi-node training synchronizes gradients (NCCL all-reduce) every step across hundreds of GPUs; with GPUDirect RDMA the NIC DMAs straight from GPU memory to GPU memory. Network stalls = idle GPUs = burned money, so clusters run 400/800G RDMA fabrics, often one NIC per GPU, on rail-optimized topologies. Supermicro sells exactly these racks, so even for a system-engineer (not network-architect) role, knowing the vocabulary — IB vs RoCE, NCCL, GPUDirect, lossless Ethernet — signals you can work on their flagship product line. Storage rides the same wave: NVMe-oF over RDMA.`
      }
    ]
  },
  {
    id: 'smci-scripting',
    title: 'Scripting & Debugging Method',
    desc: 'Shell/Python "a plus" per the JD — plus the systematic-debugging and datasheet questions candidates report.',
    questions: [
      {
        d: 'easy',
        q: 'Write a shell one-liner or short script you\'d actually use for checking a fleet of servers.',
        a: `Have one ready — e.g. SEL + temperature sweep across BMCs:<div class="ex-label">Example</div><pre><code>#!/bin/bash
# health-sweep.sh — SEL errors + inlet temp for every BMC in bmc-list.txt
while read -r bmc; do
  errs=$(ipmitool -I lanplus -H "$bmc" -U "$U" -P "$P" sel elist 2&gt;/dev/null \\
         | grep -ci error)
  temp=$(ipmitool -I lanplus -H "$bmc" -U "$U" -P "$P" sensor get "Inlet Temp" \\
         2&gt;/dev/null | awk -F: '/Sensor Reading/ {print $2}')
  printf '%-15s errors=%-4s inlet=%s\\n' "$bmc" "$errs" "$temp"
done &lt; bmc-list.txt</code></pre>Talking points: quoting, exit-code checks, and "for real fleets I'd move this to Python or Ansible with the Redfish API — JSON beats screen-scraping." That upgrade path is exactly what they want to hear.`
      },
      {
        d: 'medium',
        q: 'When do you reach for Python instead of shell, and what does that look like for server work?',
        a: `<strong>Shell</strong> for gluing commands, one-offs, &lt;50 lines. <strong>Python</strong> once you need real data structures, error handling, or an API — which for this job means <strong>Redfish over HTTPS</strong>:<div class="ex-label">Example</div><pre><code>import requests
for bmc in open('bmc-list.txt').read().split():
    r = requests.get(f'https://{bmc}/redfish/v1/Chassis/1/Thermal',
                     auth=(USER, PW), verify=False, timeout=5)
    temps = {s['Name']: s['ReadingCelsius']
             for s in r.json()['Temperatures']}
    print(bmc, temps)</code></pre>Structured JSON in, dicts out, proper exceptions, testable functions — try doing that with <code>grep</code>. Also name the parsing wins (CSV/JSON of FIO or iperf3 results with <code>--json</code>, then percentile math) and log analysis. If asked to code live it'll be small: parse a log, count events, walk a dict — practice that shape, not LeetCode hard.`
      },
      {
        d: 'medium',
        q: 'A server won\'t POST (no display, no boot). Give your systematic hardware debug.',
        a: `The question that separates parts-swappers from engineers:<ul><li><strong>Observe first:</strong> any power LEDs? Fans spin then stop, spin forever, or nothing? BMC alive (reachable, heartbeat LED)? <strong>POST code display</strong> — Supermicro boards expose the hex checkpoint via the BMC web UI: it tells you <em>where</em> init died (memory training vs PCIe vs boot device).</li><li><strong>Check the SEL</strong> via the BMC — often it flat-out names the failure (VR fault, DIMM error, thermtrip).</li><li><strong>Minimal config:</strong> strip to PSU + board + 1 CPU + 1 DIMM (in the slot the manual designates) — no add-in cards, no drives. If it POSTs, add parts back until it breaks: binary search in hardware.</li><li><strong>Change one variable at a time</strong>, keep notes — swap the DIMM before reseating three things at once.</li><li><strong>Usual suspects in order:</strong> DIMM seating/population order, CMOS reset after a failed BIOS setting, PSU cables (EPS 8-pin not fully seated), standoff shorting the board, bent CPU socket pins (inspect during reseat).</li></ul>`
      },
      {
        d: 'hard',
        q: 'They ask: "how would you debug a memory leak?" (reported real question) — answer for both a C program and a server fleet.',
        a: `<strong>C/C++ program</strong> (their embedded/firmware teams' framing):<ul><li>Confirm growth: watch RSS (<code>ps</code>, <code>/proc/&lt;pid&gt;/status</code>, <code>smem</code>) over time under steady load.</li><li><strong>Valgrind memcheck</strong> for definite/indirect leaks with allocation stacks (slow, dev-only); <strong>ASan/LSan</strong> (<code>-fsanitize=address</code>) for CI; <strong>heaptrack/massif</strong> to see <em>which call site's</em> live allocations grow even when every pointer is technically still reachable (the "growing cache" pseudo-leak).</li><li>Classic causes: missing <code>free</code> on error paths, growing containers, forgotten unregister of callbacks.</li></ul><strong>Fleet/blackbox view</strong> (system-engineer framing):<ul><li>Trend memory per process over days (node exporter/collectd graphs) — a sawtooth after service restarts is the signature.</li><li>Bisect by version: did the leak start with a firmware/driver/app release? <strong>Kernel-side leaks</strong> (drivers) show as unaccounted <code>slab</code> growth — <code>slabtop</code>, <code>/proc/meminfo</code>, and even BMC firmware itself can leak (the fix: update, and a scheduled BMC reset as mitigation).</li><li>Mitigate while root-causing: restart policy / systemd <code>MemoryMax</code> so the box doesn't OOM at 3am.</li></ul>Structure — <em>confirm, localize, root-cause, mitigate</em> — is what's being graded.`
      }
    ]
  },
  {
    id: 'smci-behavioral',
    title: 'Process & Behavioral',
    desc: 'What the interview loop looks like and the non-technical questions candidates report — tuned to your background.',
    questions: [
      {
        d: 'easy',
        q: 'What does the Supermicro interview process actually look like?',
        a: `From candidate reports (Glassdoor/Taro/InterviewQuery):<ul><li><strong>Shape:</strong> HR phone screen → 1-3 technical rounds (senior engineer, then hiring manager covering architecture + team fit) → HR wrap. ~45 min each; some teams compress it to a single onsite.</li><li><strong>Style:</strong> practical and experience-driven, <em>not</em> LeetCode-style — "explain how a server works", walk through past projects, domain questions for the team; hardware-adjacent teams sometimes do a <strong>datasheet round</strong> (read a component datasheet, answer questions) and basic Python/shell.</li><li><strong>Difficulty & timeline:</strong> rated ~2.2/5 difficulty; ~3-5 weeks start to offer, sometimes much faster.</li><li><strong>Culture signal to expect:</strong> fast-paced, customer-deadline-driven, lean process — interviewers often probe whether you can handle context-switching and direct communication with manufacturing/customers.</li></ul>Prep accordingly: deep on your own resume + the fundamentals in the other sections here, light on algorithm grinding.`
      },
      {
        d: 'easy',
        q: '"Tell me how you manage multiple tasks / daily multitasking." (reported real screen question)',
        a: `They ask this early because the role genuinely is interrupt-driven (customer escalations vs project work). A solid structure:<ul><li><strong>Triage by blast radius:</strong> production/customer-down first, then deadline-bound project work, then improvements — and I re-triage when something new lands rather than finishing whatever I happened to start.</li><li><strong>Make state visible:</strong> a single tracked list (tickets/Jira), so nothing lives only in my head and my manager can see load and re-prioritize with me.</li><li><strong>Batch interrupts:</strong> protected blocks for deep work (a migration script, a validation run), fixed windows for mail/Slack — with an exception path for true urgencies.</li><li><strong>Concrete story:</strong> pick one — e.g. supporting live PLM users while running the history-data migration: daily user issues triaged each morning, migration ran in scheduled batches overnight, weekly status kept both stakeholders aligned. [Personalize: your real example + a number.]</li></ul>`
      },
      {
        d: 'medium',
        q: 'Why Supermicro? (crafted for your Foxconn/PLM + Java background)',
        a: `Angles that ring true from your resume — pick two, say them in your own words:<ul><li><strong>Manufacturing DNA:</strong> "At Foxconn I've worked where engineering meets manufacturing — PLM, BOMs, plant transfers. Supermicro designs <em>and</em> builds its servers, largely in San Jose/Taiwan; my experience bridging business, factory, and software maps directly onto how you operate." (Also: your Mandarin + Taiwan work experience is genuinely relevant to their HQ-Taiwan collaboration.)</li><li><strong>Riding the AI buildout:</strong> "You're shipping the racks the AI wave runs on — GPU systems, liquid cooling, storage. I want my next years on infrastructure that matters at that scale."</li><li><strong>Product breadth + speed:</strong> "Building-block architecture means new platforms constantly; I like that a system engineer there touches CPUs, GPUs, storage, firmware, and real customers instead of a narrow slice."</li></ul>Avoid: compensation, "it's close to home", or reciting their revenue numbers. And have answers ready for the flip side — they may ask how you feel about a fast-paced, high-pressure environment: answer honestly with your Foxconn evidence.`
      },
      {
        d: 'medium',
        q: 'What questions should I ask them at the end?',
        a: `Good ones for this specific company/role:<ul><li>"What does a typical week split look like between new-platform bring-up, customer issues, and validation work?" (maps the actual job)</li><li>"Which product line would I support — GPU/AI systems, storage, or general compute — and how does the team interface with the Taiwan teams?" (shows you know their structure; also surfaces the time-zone reality)</li><li>"How does the team handle the pace — what does on-call or escalation actually look like?" (gets honest culture data politely)</li><li>"What separates the engineers who thrive here in their first year?" (manager-revealing)</li><li>"What's the growth path from this role — deeper into platform architecture, or toward customer-facing solution engineering?"</li></ul>Skip generic questions answerable by their website, and don't open with PTO/benefits — save that for the offer stage.`
      }
    ]
  }
];
