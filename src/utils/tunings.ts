/**
 * Guitar and instrument tuning presets
 * Standard tunings for various instruments
 */

export interface Tuning {
  name: string;
  description: string;
  notes: string[];
}

export const TUNINGS: Record<string, Tuning> = {
  standard_guitar: {
    name: 'Standard Guitar',
    description: 'Standard tuning for 6-string guitar',
    notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  drop_d: {
    name: 'Drop D',
    description: 'Drop D tuning (lower first string)',
    notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  open_g: {
    name: 'Open G',
    description: 'Open G tuning',
    notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
  },
  bass: {
    name: 'Bass',
    description: 'Standard bass tuning (4-string)',
    notes: ['E1', 'A1', 'D2', 'G2'],
  },
  violin: {
    name: 'Violin',
    description: 'Standard violin tuning',
    notes: ['G3', 'D4', 'A4', 'E5'],
  },
  ukulele: {
    name: 'Ukulele',
    description: 'Standard ukulele tuning',
    notes: ['G4', 'C4', 'E4', 'A4'],
  },
};

export const DEFAULT_TUNING = 'standard_guitar';
