
export default class Board {
    private readonly map: Record<string, Record<string, number>> = { p1: { p2: 3, p13: 4, p18: 7, p44: 6 }, p2: { p1: 7, p13: 6, p35: 4 }, p3: { p31: 3, p32: 6, p36: 4, p39: 7, p40: 2 }, p4: { p16: 4, p25: 3, p26: 7, p37: 8, p38: 2, p46: 6 }, p5: { p6: 7, p21: 4, p33: 3, p45: 6 }, p6: { p5: 3, p7: 6, p34: 7, p45: 4 }, p7: { p6: 2, p9: 6, p14: 4, p20: 7, p34: 8, p45: 3 }, p8: { p10: 4, p11: 6 }, p9: { p7: 2, p14: 3, p20: 8, p23: 7, p47: 4, p55: 6 }, p10: { p8: 8, p11: 7, p28: 4, p30: 6 }, p11: { p8: 2, p10: 3, p29: 6, p30: 4 }, p12: { p14: 7, p21: 2, p45: 8, p49: 6 }, p13: { p1: 8, p2: 2, p15: 6, p19: 4, p35: 3, p44: 7 }, p14: { p7: 8, p9: 7, p12: 3, p45: 2, p47: 6, p49: 4 }, p15: { p13: 2, p19: 3, p44: 8, p50: 4 }, p16: { p4: 8, p23: 3, p25: 2, p46: 7, p51: 4, p57: 6 }, p17: { p26: 2, p27: 7, p36: 8, p46: 3, p52: 4, p56: 6 }, p18: { p1: 3, p44: 4 }, p19: { p13: 8, p15: 7, p22: 3, p35: 2, p50: 6, p53: 4 }, p20: { p7: 3, p9: 4, p23: 6, p24: 8, p25: 7, p34: 2 }, p21: { p5: 8, p12: 6, p33: 2, p45: 7 }, p22: { p19: 7, p27: 3, p32: 2, p35: 8, p53: 6, p54: 4 }, p23: { p9: 3, p16: 7, p20: 2, p25: 8, p51: 6, p55: 4 }, p24: { p20: 4, p25: 6, p34: 3, p38: 7, p42: 8 }, p25: { p4: 7, p16: 6, p20: 3, p23: 4, p24: 2, p38: 8 }, p26: { p4: 3, p17: 6, p31: 8, p36: 7, p37: 2, p46: 4 }, p27: { p17: 3, p22: 7, p32: 8, p36: 2, p54: 6, p56: 4 }, p28: { p10: 8, p30: 7, p42: 4, p43: 6 }, p29: { p11: 2, p30: 3, p40: 6, p41: 4 }, p30: { p10: 2, p11: 8, p28: 3, p29: 7, p41: 6, p43: 4 }, p31: { p3: 7, p26: 4, p36: 6, p37: 3, p40: 8, p41: 2 }, p32: { p3: 2, p22: 6, p27: 4, p35: 7, p36: 3, p39: 8 }, p33: { p5: 7, p21: 6 }, p34: { p6: 3, p7: 4, p20: 6, p24: 7 }, p35: { p2: 8, p13: 7, p19: 6, p22: 4, p32: 3, p39: 2 }, p36: { p3: 8, p17: 4, p26: 3, p27: 6, p31: 2, p32: 7 }, p37: { p4: 4, p26: 6, p31: 7, p38: 3, p41: 8, p43: 2 }, p38: { p4: 6, p24: 3, p25: 4, p37: 7, p42: 2, p43: 8 }, p39: { p2: 7, p3: 3, p32: 4, p35: 6 }, p40: { p3: 6, p29: 2, p31: 4, p41: 3 }, p41: { p29: 8, p30: 2, p31: 6, p37: 4, p40: 7, p43: 3 }, p42: { p24: 4, p28: 8, p38: 6, p43: 7 }, p43: { p28: 2, p30: 8, p37: 6, p38: 4, p41: 7, p42: 3 }, p44: { p1: 2, p13: 3, p15: 4, p18: 8 }, p45: { p5: 2, p6: 8, p7: 7, p12: 4, p14: 6, p21: 3 }, p46: { p4: 2, p16: 3, p17: 7, p26: 8, p52: 6, p57: 4 }, p47: { p9: 8, p14: 2, p49: 3, p55: 7, p58: 4, p66: 6 }, p48: { p120: 8, p121: 2 }, p49: { p12: 2, p14: 8, p47: 7, p58: 6 }, p50: { p15: 8, p19: 2, p53: 3, p61: 4 }, p51: { p16: 8, p23: 2, p55: 3, p57: 7, p62: 4, p68: 6 }, p52: { p17: 8, p46: 2, p56: 7, p57: 3, p63: 4, p67: 6 }, p53: { p19: 8, p22: 2, p50: 7, p54: 3, p61: 6, p64: 4 }, p54: { p22: 8, p27: 2, p53: 7, p56: 3, p64: 6, p65: 4 }, p55: { p9: 2, p23: 8, p47: 3, p51: 7, p62: 6, p66: 4 }, p56: { p17: 2, p27: 8, p52: 3, p54: 7, p65: 6, p67: 4 }, p57: { p16: 2, p46: 8, p51: 3, p52: 7, p63: 6, p68: 4 }, p58: { p47: 8, p49: 2, p66: 7, p69: 6, p71: 4 }, p59: { p60: 3, p70: 2, p92: 8 }, p60: { p59: 7, p70: 8 }, p61: { p50: 8, p53: 2, p64: 3, p72: 6, p75: 4 }, p62: { p51: 8, p55: 2, p66: 3, p68: 7, p73: 6, p77: 4 }, p63: { p52: 8, p57: 2, p67: 7, p68: 3, p74: 6, p79: 4 }, p64: { p53: 8, p54: 2, p61: 7, p65: 3, p75: 6, p76: 4 }, p65: { p54: 8, p56: 2, p64: 7, p67: 3, p76: 6, p78: 4 }, p66: { p47: 2, p55: 8, p58: 3, p62: 7, p69: 4, p77: 6 }, p67: { p52: 2, p56: 8, p63: 3, p65: 7, p74: 4, p78: 6 }, p68: { p51: 2, p57: 8, p62: 3, p63: 7, p73: 4, p79: 6 }, p69: { p58: 2, p66: 8, p71: 3, p77: 7, p80: 6, p82: 4 }, p70: { p59: 6, p60: 4, p81: 8, p92: 7 }, p71: { p58: 8, p69: 7, p81: 4, p82: 6 }, p72: { p61: 2, p75: 3, p83: 6, p86: 4 }, p73: { p62: 2, p68: 8, p77: 3, p79: 7, p84: 6, p88: 4 }, p74: { p63: 2, p67: 8, p78: 7, p79: 3, p85: 6, p90: 4 }, p75: { p61: 8, p64: 2, p72: 7, p76: 3, p86: 6, p87: 4 }, p76: { p64: 8, p65: 2, p75: 7, p78: 3, p87: 6, p89: 4 }, p77: { p62: 8, p66: 2, p69: 3, p73: 7, p80: 4, p88: 6 }, p78: { p65: 8, p67: 2, p74: 3, p76: 7, p85: 4, p89: 6 }, p79: { p63: 8, p68: 2, p73: 3, p74: 7, p84: 4, p90: 6 }, p80: { p69: 2, p77: 8, p82: 3, p88: 7, p91: 6, p93: 4 }, p81: { p70: 4, p71: 8, p82: 7, p92: 6 }, p82: { p69: 8, p71: 2, p80: 7, p81: 3, p92: 4, p93: 6 }, p83: { p72: 2, p86: 3, p94: 6, p97: 4 }, p84: { p73: 2, p79: 8, p88: 3, p90: 7, p95: 6, p99: 4 }, p85: { p74: 2, p78: 8, p89: 7, p90: 3, p96: 6, p101: 4 }, p86: { p72: 8, p75: 2, p83: 7, p87: 3, p97: 6, p98: 4 }, p87: { p75: 8, p76: 2, p86: 7, p89: 3, p98: 6, p100: 4 }, p88: { p73: 8, p77: 2, p80: 3, p84: 7, p91: 4, p99: 6 }, p89: { p76: 8, p78: 2, p85: 3, p87: 7, p96: 4, p100: 6 }, p90: { p74: 8, p79: 2, p84: 3, p85: 7, p95: 4, p101: 6 }, p91: { p80: 2, p88: 8, p93: 3, p99: 7, p102: 6, p104: 4 }, p92: { p59: 4, p70: 3, p81: 2, p82: 8, p93: 7, p103: 6 }, p93: { p80: 8, p82: 2, p91: 7, p92: 3, p103: 4, p104: 6 }, p94: { p83: 2, p97: 3, p105: 6, p108: 4 }, p95: { p84: 2, p90: 8, p99: 3, p101: 7, p106: 6, p110: 4 }, p96: { p85: 2, p89: 8, p100: 7, p101: 3, p107: 6, p112: 4 }, p97: { p83: 8, p86: 2, p94: 7, p98: 3, p108: 6, p109: 4 }, p98: { p86: 8, p87: 2, p97: 7, p100: 3, p109: 6, p111: 4 }, p99: { p84: 8, p88: 2, p91: 3, p95: 7, p102: 4, p110: 6 }, p100: { p87: 8, p89: 2, p96: 3, p98: 7, p107: 4, p111: 6 }, p101: { p85: 8, p90: 2, p95: 3, p96: 7, p106: 4, p112: 6 }, p102: { p91: 2, p99: 8, p104: 3, p110: 7, p114: 6 }, p103: { p92: 2, p59: 3, p104: 7, p93: 8 }, p104: { p91: 8, p93: 2, p102: 7 }, p105: { p94: 2, p108: 3 }, p106: { p95: 2, p101: 8, p110: 3, p112: 7, p113: 4, p116: 6 }, p107: { p96: 2, p100: 8, p111: 7, p112: 3, p115: 4 }, p108: { p94: 8, p97: 2, p105: 7, p109: 3 }, p109: { p97: 8, p98: 2, p108: 7, p111: 3 }, p110: { p95: 8, p99: 2, p102: 3, p106: 7, p113: 6, p114: 4 }, p111: { p98: 8, p100: 2, p107: 3, p109: 7 }, p112: { p96: 8, p101: 2, p106: 3, p107: 7, p115: 6, p116: 4 }, p113: { p106: 8, p110: 2, p114: 3, p116: 7, p117: 6, p118: 4 }, p114: { p102: 2, p110: 8, p113: 7, p118: 6 }, p115: { p107: 8, p112: 2, p116: 3, p119: 4 }, p116: { p106: 2, p112: 8, p113: 3, p115: 7, p117: 4, p119: 6 }, p117: { p113: 2, p116: 8, p118: 3, p119: 7, p120: 6, p121: 4 }, p118: { p113: 8, p114: 2, p117: 7, p121: 6 }, p119: { p115: 8, p116: 2, p117: 3, p120: 4 }, p120: { p48: 4, p117: 2, p119: 8, p121: 3 }, p121: { p48: 6, p117: 8, p118: 2, p120: 7 } };
    private pawns: Record<string, string> = { pawn1: 'p49', pawn2: 'p34', pawn3: 'p7', pawn4: 'p14', pawn5: 'p45', pawn6: 'p12', pawn7: 'p5', pawn8: 'p6', pawn9: 'p21', pawn10: 'p33', pawn11: 'p72', pawn12: 'p83', pawn13: 'p111', pawn14: 'p94', pawn15: 'p86', pawn16: 'p98', pawn17: 'p97', pawn18: 'p109', pawn19: 'p108', pawn20: 'p105', pawn21: 'p50', pawn22: 'p19', pawn23: 'p15', pawn24: 'p35', pawn25: 'p13', pawn26: 'p44', pawn27: 'p39', pawn28: 'p2', pawn29: 'p1', pawn30: 'p18', pawn31: 'p115', pawn32: 'p48', pawn33: 'p121', pawn34: 'p120', pawn35: 'p118', pawn36: 'p117', pawn37: 'p119', pawn38: 'p114', pawn39: 'p113', pawn40: 'p116', pawn41: 'p42', pawn42: 'p43', pawn43: 'p41', pawn44: 'p40', pawn45: 'p28', pawn46: 'p30', pawn47: 'p29', pawn48: 'p10', pawn49: 'p11', pawn50: 'p8', pawn51: 'p60', pawn52: 'p59', pawn53: 'p103', pawn54: 'p104', pawn55: 'p70', pawn56: 'p92', pawn57: 'p93', pawn58: 'p81', pawn59: 'p82', pawn60: 'p71' };

    private pawnsMap: Record<string, string> = {};

    constructor() {
        for (const i in this.pawns) {
            this.pawnsMap[this.pawns[i]] = i;
        }
    }

    public getPossiblePlacesForPawn(pawn: string): string[] {
        const possiblePlaces = [];
        const placesAround = this.map[this.pawns[pawn]];

        // Iterate over places directly around the pawn
        for (const placeAround in placesAround) {

            // If a pawn is found on this place...
            if (this.pawnsMap[placeAround]) {

                // ... then iterate over places directly around this place
                for (const place2 in this.map[placeAround]) {
                    if (this.map[placeAround][place2] === placesAround[placeAround] && !this.pawnsMap[place2]) {
                        possiblePlaces.push(place2);
                    }
                }
            }
            // ... else store the place
            else {
                possiblePlaces.push(placeAround);
            }
        }
        return possiblePlaces;
    }

    public getPossiblePlacesForPlace(place: string): string[] {
        const possiblePlaces = [];
        const placesAround = this.map[place];

        // Iterate over places directly around the place
        for (const placeAround in placesAround) {

            // If a pawn is found on this place...
            if (this.pawnsMap[placeAround]) {

                // ... then iterate over places directly around this place
                for (const place2 in this.map[placeAround]) {
                    if (this.map[placeAround][place2] === placesAround[placeAround] && !this.pawnsMap[place2]) {
                        possiblePlaces.push(place2);
                    }
                }
            }
        }
        return possiblePlaces;
    }

    public placePawn(pawn: string, place: string) {
        delete this.pawnsMap[this.pawns[pawn]];
        this.pawns[pawn] = place;
        this.pawnsMap[place] = pawn;
    }

}