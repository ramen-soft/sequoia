export const instrumentRegistry : {[name:string]:{id: string, name: string, processor: string}} = {
    "piano": {
        id: 'sequoia/piano',
        name: 'Piano',
        processor: 'processors/piano.js'
    },
    "trumpet": {
        id: 'sequoia/trumpet',
        name: 'Trumpet',
        processor: 'processors/trumpet.js'
    },
    "kick": {
        id: 'sequoia/kick',
        name: 'Kick',
        processor: 'processors/kick.js'
    },
    "snare": {
        id: 'sequoia/snare',
        name: 'Snare',
        processor: 'processors/snare.js'
    },
    "hithat": {
        id: 'sequoia/hithat',
        name: 'HitHat',
        processor: 'processors/hithat.js'
    }
}