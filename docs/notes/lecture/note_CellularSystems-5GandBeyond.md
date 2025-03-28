# Cellular systems - 5G and beyond Part 1
### Stefan Parkval, IEEE fellow, Sernior Expert Ericsson Research

*Grimeton

## 1.Intro

mobile broadband started since 4G
5G - beyond smartphones
6G - intelligient communication erver-presenting

## 2.Cellular netwrok
2 basic factor: coverage, mobility

- spectrum

    lower bands(sub6): reasonable bandwidth(20 MHz or so), good coverage, typically fdd
    
    higer bands: wide bandwidth(100MHz or so) -> high data rates, coverage (bad pathloss, beamforming crucial), typically tdd

    NR 3GHz ~ 30GHz

    **why high frequency tdd?**
    
        most important: regulations,
        
        historical
        
        technically: 1. UL/DL switch require guard time, in low frequency, guardtime is too long; 2. high frequency, seperation of adjacent frequency is harder. TDD does not have that problem.

    licensed and unlicensed

- cellular

    inter-site distance: 100-300m dense urban ~ kms rural

    power: dl ~20~200W < macro, < 1W indoor
           ul 200 mW
    
    reuse 1: ICI

    - ICI in TDD:

        DL to UL, UL to DL ICI
        
        solution: synchronization ( <3 micro seconds, $\mu s$)
                  guard period
                  
                  intersting problem: how about in numerology 6? 
                  in this case, the cell is much smaller, and beamforming existing, naturally cancell large part of ICI

- LTE waveform and frame structure                  

    dl: plain OFDM
    ul: DFT-precoded OFDM, to reduce PAR峰均比 

    1 subframe consists of 14 symbols (multipath delay shift<4.7ms is ok )

- Channel-dependent scheduling

    circuit-switched / packet switched (now)

    scheduling: schedule each subframe(1ms): whom? what rate? rate adaptations.
    
    basic idea!

        in time:
        transmit fading peaks
    
        in time-freq:
        2D peak

    how to schedule?

        dl: ue reported CSI (10ms), and data amont
        
        ul: scheduling request, indicating data presence, then BS requests buffer status and so on, and schedule RBs

- Error

    not due to congestion, but fading

    **hide** error from TCP

    HARQ in MAC, and ARQ in RLC

    retransmission scheduled a few ms later, use outband (PUSCH?)

- battery lifetime

    radio is power consuming

    RRC_IDLE, RRC_INACTIVE(NR only, with RRC context, coreNet connection, but no data transfoer ), RRC_Conected. In 5G, RRC_Inactive is used to reduce frequent signalling.

- connect

    RRC_IDLE -> cell search

    scan for synchronization signals (PSS and SSS, every 5ms in 4G, good self-correlated sequence)

    once found, get sync-ed, know the start of frames, read systems informations (cell ID)

    in 5G, synchronizaiotn signal interval increased to 20ms, for power efficency (part of commercial reason)

    once connect, random access, preamble transmission -> random access response

- mobility

    connected state mobility: network decides, network knows us's cell

    idle state mobility: ue determines, bs does not know ue's location cell 


## 3. LTE evolusion

Rel-8/9 ~ Rel-15, but stopped now, switched to 5G/6G

CA is the most useful feature introduced in 4G

    - exploitation of fragmented specturm
    - higher data rate

    - Licence assist comm: aggregate liscensed and unlicenced, listen before talk on unlicenced

mMTC, cat-M and NB-IoT

## 4. 5G NR

- ultra-lean design: reduce control overheads
- wide spectrum
- multi-antenna
- low lattency
- forward compatibility (good job, 6G based on 5G)

- LTE-NR coexistence
- Network slicing (service-based slicing)
    
    slice happens in coreNet, basically assign a slice ID to each packet/session(and deploy different schedule policies)

    interesting: 5G SA core is required to support this feature, but NSA is first released, so some operators choosed NSA to reduce coreNet cost instead of choosing SA and having more 5G capabilities.

- modular architecture: DU/CU, CP(anel)/UP

- Dynamic TDD: 
    
    slot structure:
    ![alt text](image.png)

    consideration: since not full synchronized, inteference matters
    macro: semi-statid, reduce ici
    small cell: dynamic, more free without serious ici

- multianntenna

    common toolbox

- beamforming (spatial filter)

    challening to point in the right dir, also challenging when moving fast

    FR1: digital beamforming, across arbitary bandwidth
    FR2: 数模混合波束赋形, more limitation in frequency

- Ericsson spectrum sharing
    for introducing 5G in 4G, smooth network migration

    books 5G/5G-advanced...