import { Colour } from '.';
import Pawn from '../pawn';
import './index.less';

interface IProps {
    canMove: {
        [key in Colour]: boolean
    };
}

const BoardComponent = (props: IProps) => {
    const canMoveBlue = props.canMove[Colour.Blue];
    const canMoveGreen = props.canMove[Colour.Green];
    const canMoveYellow = props.canMove[Colour.Yellow];
    const canMoveBlack = props.canMove[Colour.Black];
    const canMoveRed = props.canMove[Colour.Red];
    const canMovePurple = props.canMove[Colour.Purple];
    return <svg viewBox="0 137 744.09448819 800" className="board">
        <g>
            <circle r="20" cy="351.41861" cx="103.51184" id="p1" className="place red"></circle>
            <circle r="20" cy="351.41861" cx="157.21387" id="p2" className="place red"></circle>
            <circle className="place empty" id="p3" cx="264.68689" cy="351.55698" r="20"></circle>
            <circle className="place empty" id="p4" cx="398.75223" cy="398.23935" r="20"></circle>
            <circle r="20" cy="351.43152" cx="640.53943" id="p5" className="place blue"></circle>
            <circle className="place blue" id="p6" cx="586.89661" cy="351.3801" r="20"></circle>
            <circle className="place blue" id="p7" cx="560.06781" cy="397.95474" r="20"></circle>
            <circle r="20" cy="165.56793" cx="372.18066" id="p8" className="place black"></circle>
            <circle className="place empty" id="p9" cx="533.26129" cy="444.56781" r="20"></circle>
            <circle r="20" cy="212.07121" cx="399.02933" id="p10" className="place black"></circle>
            <circle r="20" cy="212.24402" cx="344.99753" id="p11" className="place black"></circle>
            <circle className="place blue" id="p12" cx="640.69855" cy="444.56781" r="20"></circle>
            <circle r="20" cy="397.94754" cx="130.37534" id="p13" className="place red"></circle>
            <circle className="place blue" id="p14" cx="586.95355" cy="444.52213" r="20"></circle>
            <circle r="20" cy="444.55057" cx="103.40286" id="p15" className="place red"></circle>
            <circle className="place empty" id="p16" cx="425.60605" cy="444.75153" r="20"></circle>
            <circle r="20" cy="444.59222" cx="318.40085" id="p17" className="place empty"></circle>
            <circle className="place red" id="p18" cx="49.67728" cy="351.49512" r="20"></circle>
            <circle r="20" cy="444.47647" cx="157.23883" id="p19" className="place red"></circle>
            <circle className="place empty" id="p20" cx="506.42407" cy="398.08435" r="20"></circle>
            <circle r="20" cy="397.95474" cx="667.75006" id="p21" className="place blue"></circle>
            <circle className="place empty" id="p22" cx="210.9425" cy="444.47934" r="20"></circle>
            <circle r="20" cy="444.78067" cx="479.25262" id="p23" className="place empty"></circle>
            <circle r="20" cy="351.58102" cx="479.57538" id="p24" className="place empty"></circle>
            <circle className="place empty" id="p25" cx="452.40161" cy="398.27335" r="20"></circle>
            <circle r="20" cy="398.19781" cx="345.09854" id="p26" className="place empty"></circle>
            <circle className="place empty" id="p27" cx="264.64651" cy="444.48291" r="20"></circle>
            <circle r="20" cy="258.57449" cx="425.87802" id="p28" className="place black"></circle>
            <circle className="place black" id="p29" cx="318.19077" cy="258.70276" r="20"></circle>
            <circle r="20" cy="258.75134" cx="371.84854" id="p30" className="place black"></circle>
            <circle r="20" cy="351.67966" cx="318.2413" id="p31" className="place empty"></circle>
            <circle r="20" cy="397.95074" cx="237.78116" id="p32" className="place empty"></circle>
            <circle className="place blue" id="p33" cx="694.41724" cy="351.52441" r="20"></circle>
            <circle r="20" cy="351.3873" cx="533.18213" id="p34" className="place blue"></circle>
            <circle className="place red" id="p35" cx="184.07819" cy="397.94901" r="20"></circle>
            <circle r="20" cy="398.07458" cx="291.54385" id="p36" className="place empty"></circle>
            <circle className="place empty" id="p37" cx="371.89841" cy="351.72714" r="20"></circle>
            <circle r="20" cy="351.76599" cx="425.55057" id="p38" className="place empty"></circle>
            <circle className="place red" id="p39" cx="210.9158" cy="351.41861" r="20"></circle>
            <circle className="place black" id="p40" cx="291.38403" cy="305.16153" r="20"></circle>
            <circle className="place black" id="p41" cx="345.04459" cy="305.21497" r="20"></circle>
            <circle className="place black" id="p42" cx="452.72672" cy="305.07776" r="20"></circle>
            <circle r="20" cy="305.25867" cx="398.69955" id="p43" className="place black"></circle>
            <circle className="place red" id="p44" cx="76.540039" cy="398.02283" r="20"></circle>
            <circle r="20" cy="397.95474" cx="613.83923" id="p45" className="place blue"></circle>
            <circle r="20" cy="444.71591" cx="371.95578" id="p46" className="place empty"></circle>
            <circle className="place empty" id="p47" cx="560.1214" cy="491.09088" r="20"></circle>
            <circle className="place yellow" id="p48" cx="372.03085" cy="909.82788" r="20"></circle>
            <circle className="place blue" id="p49" cx="613.83923" cy="491.08954" r="20"></circle>
            <circle r="20" cy="491.07831" cx="130.26566" id="p50" className="place red"></circle>
            <circle className="place empty" id="p51" cx="452.45987" cy="491.2637" r="20"></circle>
            <circle r="20" cy="491.10989" cx="345.25781" id="p52" className="place empty"></circle>
            <circle r="20" cy="491.0054" cx="184.10233" id="p53" className="place empty"></circle>
            <circle className="place empty" id="p54" cx="237.80685" cy="491.0097" r="20"></circle>
            <circle r="20" cy="491.28799" cx="506.10364" id="p55" className="place empty"></circle>
            <circle className="place empty" id="p56" cx="291.51187" cy="491.01505" r="20"></circle>
            <circle r="20" cy="491.23407" cx="398.81305" id="p57" className="place empty"></circle>
            <circle className="place empty" id="p58" cx="586.97009" cy="537.59418" r="20"></circle>
            <circle className="place purple" id="p59" cx="640.3587" cy="723.82465" r="20"></circle>
            <circle className="place purple" id="p60" cx="694.36487" cy="723.6073" r="20"></circle>
            <circle r="20" cy="537.60602" cx="157.12845" id="p61" className="place empty"></circle>
            <circle className="place empty" id="p62" cx="479.31372" cy="537.77588" r="20"></circle>
            <circle r="20" cy="537.6275" cx="372.11478" id="p63" className="place empty"></circle>
            <circle r="20" cy="537.53436" cx="210.96582" id="p64" className="place empty"></circle>
            <circle className="place empty" id="p65" cx="264.67117" cy="537.54004" r="20"></circle>
            <circle r="20" cy="537.79529" cx="532.95465" id="p66" className="place empty"></circle>
            <circle className="place empty" id="p67" cx="318.3772" cy="537.54718" r="20"></circle>
            <circle r="20" cy="537.75214" cx="425.67029" id="p68" className="place empty"></circle>
            <circle className="place empty" id="p69" cx="559.80566" cy="584.30261" r="20"></circle>
            <circle className="place purple" id="p70" cx="667.51611" cy="677.104" r="20"></circle>
            <circle className="place purple" id="p71" cx="613.81879" cy="584.09747" r="20"></circle>
            <circle r="20" cy="584.04999" cx="130.30804" id="p72" className="place green"></circle>
            <circle className="place empty" id="p73" cx="452.52756" cy="584.27026" r="20"></circle>
            <circle r="20" cy="584.07935" cx="345.24252" id="p74" className="place empty"></circle>
            <circle r="20" cy="584.13373" cx="183.99124" id="p75" className="place empty"></circle>
            <circle className="place empty" id="p76" cx="237.82928" cy="584.06329" r="20"></circle>
            <circle r="20" cy="584.28809" cx="506.16754" id="p77" className="place empty"></circle>
            <circle className="place empty" id="p78" cx="291.53546" cy="584.07043" r="20"></circle>
            <circle r="20" cy="584.14514" cx="398.97174" id="p79" className="place empty"></circle>
            <circle className="place empty" id="p80" cx="533.02136" cy="630.80029" r="20"></circle>
            <circle className="place purple" id="p81" cx="640.66748" cy="630.60077" r="20"></circle>
            <circle className="place purple" id="p82" cx="586.65668" cy="630.80994" r="20"></circle>
            <circle r="20" cy="630.52277" cx="103.47699" id="p83" className="place green"></circle>
            <circle className="place empty" id="p84" cx="425.8287" cy="630.66278" r="20"></circle>
            <circle r="20" cy="630.60089" cx="318.39984" id="p85" className="place empty"></circle>
            <circle r="20" cy="630.68683" cx="157.23386" id="p86" className="place green"></circle>
            <circle className="place empty" id="p87" cx="210.87494" cy="630.69769" r="20"></circle>
            <circle r="20" cy="630.78839" cx="479.3848" id="p88" className="place empty"></circle>
            <circle className="place empty" id="p89" cx="264.69281" cy="630.59222" r="20"></circle>
            <circle r="20" cy="630.61151" cx="372.10788" id="p90" className="place empty"></circle>
            <circle className="place empty" id="p91" cx="506.24203" cy="677.30652" r="20"></circle>
            <circle className="place purple" id="p92" cx="613.50775" cy="677.31732" r="20"></circle>
            <circle className="place purple" id="p93" cx="559.87518" cy="677.3125" r="20"></circle>
            <circle r="20" cy="676.99561" cx="76.645874" id="p94" className="place green"></circle>
            <circle className="place empty" id="p95" cx="398.97327" cy="677.14362" r="20"></circle>
            <circle r="20" cy="677.12115" cx="291.55627" id="p96" className="place empty"></circle>
            <circle r="20" cy="677.24872" cx="130.45422" id="p97" className="place green"></circle>
            <circle className="place green" id="p98" cx="184.1597" cy="677.32379" r="20"></circle>
            <circle r="20" cy="677.18042" cx="452.68567" id="p99" className="place empty"></circle>
            <circle className="place empty" id="p100" cx="237.71683" cy="677.18921" r="20"></circle>
            <circle r="20" cy="677.13123" cx="345.26413" id="p101" className="place empty"></circle>
            <circle className="place empty" id="p102" cx="479.54266" cy="723.69806" r="20"></circle>
            <circle className="place purple" id="p103" cx="586.729" cy="723.82465" r="20"></circle>
            <circle className="place purple" id="p104" cx="533.0993" cy="723.82465" r="20"></circle>
            <circle r="20" cy="723.63141" cx="49.908939" id="p105" className="place green"></circle>
            <circle className="place empty" id="p106" cx="372.12845" cy="723.66162" r="20"></circle>
            <circle r="20" cy="723.71692" cx="264.57962" id="p107" className="place empty"></circle>
            <circle r="20" cy="723.82465" cx="104.06158" id="p108" className="place green"></circle>
            <circle className="place green" id="p109" cx="157.43149" cy="723.97467" r="20"></circle>
            <circle r="20" cy="723.67572" cx="425.83856" id="p110" className="place empty"></circle>
            <circle className="place green" id="p111" cx="211.08548" cy="723.96063" r="20"></circle>
            <circle r="20" cy="723.65009" cx="318.41977" id="p112" className="place empty"></circle>
            <circle className="place yellow" id="p113" cx="398.99277" cy="770.19196" r="20"></circle>
            <circle className="place yellow" id="p114" cx="452.70392" cy="770.20789" r="20"></circle>
            <circle className="place yellow" id="p115" cx="291.44241" cy="770.24463" r="20"></circle>
            <circle r="20" cy="770.17902" cx="345.28326" id="p116" className="place yellow"></circle>
            <circle className="place yellow" id="p117" cx="372.14676" cy="816.70795" r="20"></circle>
            <circle className="place yellow" id="p118" cx="425.85712" cy="816.72235" r="20"></circle>
            <circle r="20" cy="816.7724" cx="318.30524" id="p119" className="place yellow"></circle>
            <circle className="place yellow" id="p120" cx="345.16806" cy="863.30017" r="20"></circle>
            <circle className="place yellow" id="p121" cx="399.01025" cy="863.23688" r="20"></circle>
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn1" x={613.83923} y={491.08954} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn2" x={533.18213} y={351.3873} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn3" x={560.06781} y={397.95474} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn4" x={586.95355} y={444.52213} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn5" x={613.83923} y={397.95474} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn6" x={640.69855} y={444.56781} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn7" x={640.53943} y={351.43152} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn8" x={586.89661} y={351.3801} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn9" x={667.75006} y={397.95474} r={16.071173} />
            <Pawn canMove={canMoveBlue} colour={Colour.Blue} id="pawn10" x={694.41724} y={351.52441} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn11" x={130.30804} y={584.04999} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn12" x={103.47699} y={630.52277} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn13" x={211.08548} y={723.96063} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn14" x={76.645874} y={676.99561} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn15" x={157.23386} y={630.68683} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn16" x={184.1597} y={677.32379} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn17" x={130.45422} y={677.24872} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn18" x={157.43149} y={723.97467} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn19" x={104.06158} y={723.82465} r={16.071173} />
            <Pawn canMove={canMoveGreen} colour={Colour.Green} id="pawn20" x={49.908939} y={723.63141} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn21" x={130.26566} y={491.07831} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn22" x={157.23883} y={444.47647} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn23" x={103.40286} y={444.55057} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn24" x={184.07819} y={397.94901} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn25" x={130.37534} y={397.94754} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn26" x={76.540039} y={398.02283} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn27" x={210.9158} y={351.41861} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn28" x={157.21387} y={351.41861} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn29" x={103.51184} y={351.41861} r={16.071173} />
            <Pawn canMove={canMoveRed} colour={Colour.Red} id="pawn30" x={49.67728} y={351.49512} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn31" x={291.44241} y={770.24463} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn32" x={372.03085} y={909.82788} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn33" x={399.01025} y={863.23688} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn34" x={345.16806} y={863.30017} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn35" x={425.85712} y={816.72235} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn36" x={372.14676} y={816.70795} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn37" x={318.30524} y={816.7724} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn38" x={452.70392} y={770.20789} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn39" x={398.99277} y={770.19196} r={16.071173} />
            <Pawn canMove={canMoveYellow} colour={Colour.Yellow} id="pawn40" x={345.28326} y={770.17902} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn41" x={452.72672} y={305.07776} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn42" x={398.69955} y={305.25867} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn43" x={345.04459} y={305.21497} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn44" x={291.38403} y={305.16153} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn45" x={425.87802} y={258.57449} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn46" x={371.84854} y={258.75134} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn47" x={318.19077} y={258.70276} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn48" x={399.02933} y={212.07121} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn49" x={344.99753} y={212.24402} r={16.071173} />
            <Pawn canMove={canMoveBlack} colour={Colour.Black} id="pawn50" x={372.18066} y={165.56793} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn51" x={694.36487} y={723.6073} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn52" x={640.3587} y={723.82465} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn53" x={586.729} y={723.82465} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn54" x={533.0993} y={723.82465} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn55" x={667.51611} y={677.104} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn56" x={613.50775} y={677.31732} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn57" x={559.87518} y={677.3125} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn58" x={640.66748} y={630.60077} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn59" x={586.65668} y={630.80994} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn59" x={586.65668} y={630.80994} r={16.071173} />
            <Pawn canMove={canMovePurple} colour={Colour.Purple} id="pawn60" x={613.81879} y={584.09747} r={16.071173} />
        </g>
    </svg>;
};
export default BoardComponent;