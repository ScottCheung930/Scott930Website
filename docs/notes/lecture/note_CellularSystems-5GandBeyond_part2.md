# Cellular systems - 5G and beyond Part 2
### Stefan Parkval, IEEE fellow, Sernior Expert Ericsson Research

## 1.Standardization in practice

### Why
- standard can be de-facto, de jure, voluntary, where cellular network is the last one
- Technology development - selecting the best solution
- interoperability - samsung phone in Ericsson network
- mass market - scale effect of economy

### What
- logical arch
- protocol on interfaces
- RF/ Radio transmitter, law consideration
- behavior, functionality

not do:(where competetion exists)
- physical implementation
- algorithm

### Where
- standard-developing org.: 3GPP, IEEE, ETSI, O-RAN
    -  nonprofit
    -  technical
    -  global/reginal/national
- Regulatory bodies: ITU, FCC, ECC, ...
    - governmental
    - spectrum usage
    - products
- Insdustry fora: wifi, GSM world
    - promoting and lobbying for specific technologies
### Process
- stage 1 Requirement
- stage 2 logical architechture, fucntional split, interfaces, rough solution
- stage 3 details: header format, coding scheme, quantitizaed requirements
- Test: test cases 

## ITU
- founded in 1865, second oldest international organization stll running       
    Rhine navigation is the first)
- standardization
- global (almose) radio specturm allocation 

### ITU-R
- Radio regulations:
    - different frequency bands
    - mandatory technical parameters to be observed
- Reports
- Recommodations:
    - approves standards, such as, from 3GPP

### IMT-2000 (3G)
6 technologies: CDMA, CDMA-TDD, ...
### IMT-advanced (4G)
LTE

WiMAN (wimax): never used
### IMT-2020 (5G)
NR

DECT-2020: never used

### IMT-2030 (6H)
24-26 : requirement

27-28 : proposal

29-30 : Eval&Spec

## 3GPP
founded in lalet 90s, for 2G standards 

(although 'G' concept hadn't been invented then)

### Org
- TSG: RAN, SA (Service&overall system), CT (core network)

    RAN WG1(RAN1), RAN WG2, ....

    SA1, SA2, ... SA6

### Standardizatin in practice
- contribution driven
- decision by cnosensus, including small talks in coffe-breaks 
    - tech, commercial, political ...
- socials
- one week meetings, long meeting dats
- no voting

## ORAN
not buy basestation products, but buy components, with common interfaces across different companies.

- started 2018
- operator-driven, including CMCC
- all big player except huawei

problem: 
- two complicated. 
- highly integration is required by real-time performance, robustness ....

But at least open frontaul is good (from the Ericsson's perspective)

Because anyway further decoupling of fraontaul and baseband is necessary.

!!! "What is the role of academia in standarization"

    none, but impact the standardization
    personal reflection from speaker:
        academia is too close to 3GPP, no one is aiming at 2040!

## 6G
- officially started in march 2025
- now 6G requirements stage

### requirement
- joint capabilities
- application determined

### princeiples
- standalone (should not have NSA 6G)
- interface an 5G Core, which is flexible enough, and just deployed by operators
    
    different from NSA between 4G and 5G.
    
    6G phone only connects 6G RAN, shall not support any 5G phone, to avoid NSA issue like the transition from 4G to 5G.

- intent-based and programmable

    more granularity on commercialized service 

- selected open interfaces
- operatee in all existing 3GPP bands, and in new cmWave bands
- spectrum sharing between 5G and 6G
- new and evolved use cases

### overall design guideline

- Keep: waveform, coding(LDPC; polar), modulation(OFDM), mimo and multi-antenna features

- Change: aggregation (UL-DL decoupling! best DL may not be the best UL), energy performance, scheduling and control signalling

- Add: 
    ovservability (collect detail statistics from network)
    resillient communications
    isac
    service-level agreement
    - intent driven netwwork to automated SLA management: to this task, the network will provide this kind of service and charge in this scheme...

### Massive IoT
Ambidient IoT, replace NBIoT or CAT-M, without sacrificing 6G performance

should consider from day 1 of 6G

### Non-terrestrial access
as a complement to terrestrial access

deployment: focus on LEO, both handheld and VSAT

avoid dependency on externall technologies such as GNSS

### ISAC
reuse the communication specturm and infra


