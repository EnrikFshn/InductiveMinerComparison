require("pm4js/init");

const fs = require('fs');
const { XesImporter } = require('./node_modules/pm4js/pm4js/objects/log/importer/xes/importer.js');
const { InductiveMiner } = require('./node_modules/pm4js/pm4js/algo/discovery/inductive/algorithm.js');
const { FrequencyDfgDiscovery } = require('./node_modules/pm4js/pm4js/algo/discovery/dfg/algorithm.js');
const { ProcessTreeVanillaVisualizer } = require('./node_modules/pm4js/pm4js/visualization/process_tree/vanilla_graphviz.js');
const { ProcessTreeToPetriNetConverter } = require('./node_modules/pm4js/pm4js/objects/conversion/process_tree/to_petri_net.js');
const { PetriNetVanillaVisualizer } = require('./node_modules/pm4js/pm4js/visualization/petri_net/vanilla_graphviz.js');
const { WfNetToBpmnConverter } = require('./node_modules/pm4js/pm4js/objects/conversion/wf_net/to_bpmn.js');
const { DfgAlignments } = require('./node_modules/pm4js/pm4js/algo/conformance/alignments/dfg/algorithm.js');
const { TokenBasedReplay } = require('./node_modules/pm4js/pm4js/algo/conformance/tokenreplay/algorithm.js');
const { PetriNetAlignments } = require('./node_modules/pm4js/pm4js/algo/conformance/alignments/petri_net/algorithm.js');
const { TbrFitness } = require('./node_modules/pm4js/pm4js/algo/evaluation/petri_net/fitness/tbr.js');
const { AlignmentsFitness } = require('./node_modules/pm4js/pm4js/algo/evaluation/petri_net/fitness/alignments.js');
const { GeneralizationTbr } = require('./node_modules/pm4js/pm4js/algo/evaluation/petri_net/generalization/tbr_result.js');
const { SimplicityArcDegree } = require('./node_modules/pm4js/pm4js/algo/evaluation/petri_net/simplicity/arc_degree.js');
const { DfgSliders } = require('./node_modules/pm4js/pm4js/objects/dfg/util/sliders.js');
const { DfgPlayout } = require('./node_modules/pm4js/pm4js/algo/simulation/playout/dfg/algorithm.js');

fs.readFile('PrepaidTravelCost.xes', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File contents successfully read.');

    try {
        // event log was imported
        let eventLog = XesImporter.apply(data);
        console.log('Imported event log:', eventLog);

        // ------------------------------------------------------------------------------------------------------

        // INDUCTIVE MINER of the event log gives a process tree
        let processTree = InductiveMiner.applyPlugin(eventLog, "concept:name", 0.2);
        console.log('Inductive Miner of the event log:', processTree);

        // visualization of the process tree with the Viz.js library
        let gv1 = ProcessTreeVanillaVisualizer.apply(processTree);
        console.log('Process trees with inductive miner - Visualization vanilla Graphviz', gv1);

        // the process tree can be converted to an accepting Petri Net model
        let acceptingPetriNet1 = ProcessTreeToPetriNetConverter.apply(processTree);
        console.log('The accepting Petri Net of the event log from the Inductive Miner:', acceptingPetriNet1);

        // visualization of the accepting Petri Net with the Viz.js library
        let petriNetModel1 = PetriNetVanillaVisualizer.apply(acceptingPetriNet1);
        console.log('Petri Net model with inductive miner - Visualization vanilla Graphviz', petriNetModel1);

        // converting an accepting Petri net to BPMN
        let bpmnGraph1 = WfNetToBpmnConverter.apply(acceptingPetriNet1);
        console.log('BPMN diagram of the Petri Net', bpmnGraph1);

        // Alignments on Petri nets
        let alignmentResultPN1 = PetriNetAlignments.apply(eventLog, acceptingPetriNet1) 
        console.log('Alignment on the Petri Nets', alignmentResultPN1);

        // Token Based Replay
        let tokenBasedReplayResult1 = TokenBasedReplay.apply(eventLog, acceptingPetriNet1); 
        console.log('Token based replay', tokenBasedReplayResult1);

        // Replay Fitness of Petri nets
        let fitnessResultTbr1 = TbrFitness.apply(eventLog, acceptingPetriNet1);
        console.log('Fitness of the event log against the accepting Petri net model using token-based replay.', fitnessResultTbr1);

        let fitnessResultAlignment1 = AlignmentsFitness.apply(eventLog, acceptingPetriNet1);
        console.log('Fitness of the event log against the accepting Petri net model using alignments.', fitnessResultAlignment1);

        // Generalization of Petri nets
        let generalization1 = GeneralizationTbr.apply(eventLog, acceptingPetriNet1);
        console.log('Generalization of Petri nets.', generalization1);

        // Simplicity of Petri nets
        let simplicity1 = SimplicityArcDegree.apply(acceptingPetriNet1);
        console.log('Simplicity of Petri nets.', simplicity1);


        // ------------------------------------------------------------------------------------------------------

  
        // INDUCTIVE MINER DIRECTLY FOLLOWS accepts as input a directly-follows graph and returns a process tree
        let frequencyDfg = FrequencyDfgDiscovery.apply(eventLog, "concept:name");
        let processTree1 = InductiveMiner.apply(null, null, 0.0, frequencyDfg);

        console.log('Frequency Dfg of the event log:', frequencyDfg);
        console.log('Inductive Miner Directly Follows of the event log:', processTree1);

        // visualization of the process tree with the Viz.js library
        let gv2 = ProcessTreeVanillaVisualizer.apply(processTree1);
        console.log('Process trees with inductive miner directly follows - Visualization vanilla Graphviz', gv2);

        // the process tree can be converted to an accepting Petri Net model
        let acceptingPetriNet2 = ProcessTreeToPetriNetConverter.apply(processTree1);
        console.log('The accepting Petri Net of the event log from the Inductive Miner Directly Follows:', acceptingPetriNet2);

        // visualization of the accepting Petri Net with the Viz.js library
        let petriNetModel2 = PetriNetVanillaVisualizer.apply(acceptingPetriNet2); 
        console.log('Petri Net model with inductive miner directly follows - Visualization vanilla Graphviz', petriNetModel2);

        // converting an accepting Petri net to BPMN
        let bpmnGraph2 = WfNetToBpmnConverter.apply(acceptingPetriNet2);
        console.log('BPMN diagram of the Petri Net', bpmnGraph2); 

        // Alignments on Directly Follows Graphs
        let alignmentResultDFG = DfgAlignments.apply(eventLog, frequencyDfg);
        console.log('Alignment on the DFG', alignmentResultDFG);

        // Alignments on Petri nets
        let alignmentResultPN2 = PetriNetAlignments.apply(eventLog, acceptingPetriNet2) 
        console.log('Alignment on the Petri Nets', alignmentResultPN2);

        // Token Based Replay
        let tokenBasedReplayResult2 = TokenBasedReplay.apply(eventLog, acceptingPetriNet2); 
        console.log('Token based replay', tokenBasedReplayResult2);

        // Replay Fitness of Petri nets
        let fitnessResultTbr2 = TbrFitness.apply(eventLog, acceptingPetriNet2)
        console.log('Fitness of the event log against the accepting Petri net model using token-based replay.', fitnessResultTbr2);

        let fitnessResultAlignment2 = AlignmentsFitness.apply(eventLog, acceptingPetriNet2)
        console.log('Fitness of the event log against the accepting Petri net model using alignments.', fitnessResultAlignment2);

        // Generalization of Petri nets
        let generalization2 = GeneralizationTbr.apply(eventLog, acceptingPetriNet2);
        console.log('Generalization of Petri nets.', generalization2);

        // Simplicity of Petri nets
        let simplicity2 = SimplicityArcDegree.apply(acceptingPetriNet2);
        console.log('Simplicity of Petri nets.', simplicity2);

        // Sliding Directly Follows Graphs
        let filteredDfg = DfgSliders.filterDfgOnPercActivities(frequencyDfg, 0.2);
        console.log('Sliding Directly Follows Graphs', filteredDfg);

        // Playout of a DFG
        let simulatedLog = DfgPlayout.apply(frequencyDfg);
        console.log('Playout of a DFG', simulatedLog);


    } catch (e) {
        console.error('Error importing XES file:', e);
    }
});
