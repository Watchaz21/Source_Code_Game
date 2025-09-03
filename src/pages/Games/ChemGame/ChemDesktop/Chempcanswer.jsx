import React from 'react';

import acuteToxicity from '/src/assets/ChemPic/Symbols/acute-toxicity.png';
import compressedGas from '/src/assets/ChemPic/Symbols/compressed-gas.png';
import corrosive from '/src/assets/ChemPic/Symbols/corrosive.png';
import environmental from '/src/assets/ChemPic/Symbols/environmental.png';
import explosives from '/src/assets/ChemPic/Symbols/explosives.png';
import flammables from '/src/assets/ChemPic/Symbols/flammables.png';
import irritants from '/src/assets/ChemPic/Symbols/irritants.png';
import oxidisers from '/src/assets/ChemPic/Symbols/oxidisers.png';
import specificToxicity from '/src/assets/ChemPic/Symbols/specific-toxicity.png';

const pictograms = [
  {
    id: 'explosives',
    name: 'Explosives',
    img: explosives,
    desc: 'Materials that may explode under impact, heat, or pressure.',
  },
  {
    id: 'flammables',
    name: 'Flammables',
    img: flammables,
    desc: 'Substances that ignite easily when exposed to flame or heat.',
  },
  {
    id: 'oxidisers',
    name: 'Oxidisers',
    img: oxidisers,
    desc: 'Chemicals that intensify fires by releasing oxygen.',
  },
  {
    id: 'compressedGas',
    name: 'Compressed Gas',
    img: compressedGas,
    desc: 'Gases stored under pressure; may explode if heated.',
  },
  {
    id: 'corrosive',
    name: 'Corrosive',
    img: corrosive,
    desc: 'Substances that can corrode skin and metals, causing burns.',
  },
  {
    id: 'acuteToxicity',
    name: 'Acute Toxicity',
    img: acuteToxicity,
    desc: 'Rapidly toxic; potentially fatal.',
  },
  {
    id: 'irritants',
    name: 'Irritants',
    img: irritants,
    desc: 'Causes irritation to skin, eyes, or respiratory tract.',
  },
  {
    id: 'specificToxicity',
    name: 'Specific Toxicity',
    img: specificToxicity,
    desc: 'Damages specific organs such as the liver, lungs, or brain.',
  },
  {
    id: 'environmental',
    name: 'Environmental Hazard',
    img: environmental,
    desc: 'Harmful to aquatic life and the environment.',
  },
];
const Chempcanswer = () => {
  return (
    <div className="bg-default h-screen flex justify-center items-center p-6">
      <div className="bg-white w-[1328px] h-[704px] top-[189px]  rounded-2xl p-4 shadow-lg">
        <div className='border-5 w-full h-full rounded-2xl flex flex-col justify-evenly items-center p-2'>
          <h1 className="text-4xl font-bold text-center mb-1">GHS Pictograms</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full p-2">
            {pictograms.map(pic => (
              <div key={pic.id} className="text-center flex justify-center items-center">
                <img
                  src={pic.img}
                  alt={pic.name}
                  className="w-[30%]"
                />
                <div className='flex flex-col justify-center items-center'>
                  <h3 className="mt-2 text-2xl font-semibold">{pic.name}</h3>
                  <p className="mt-0 text-xl text-start p-3 text-gray-700 font-medium">{pic.desc}</p>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chempcanswer;