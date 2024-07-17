import React from 'react';

const PublicCompaniesHoldings = ({ companies }) => {
  return (
    <div className="p-3 border-[2px] rounded-lg border-gray-600 bg-gray-950">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">Public Companies Holdings</h2>
      <table className="w-full text-xs">
        <thead>
          <tr className='uppercase leading-normal border-b-[1px] border-gray-800 text-xs'>
            <th className="text-left text-gray-500 font-semibold py-2">Company</th>
            <th className="text-right text-gray-500 font-semibold py-2">Bitcoin</th>
            <th className="text-right text-gray-500 font-semibold py-2">Ethereum</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.name}>
              <td className='text-left py-2 uppercase text-blue-400'>{company.name}</td>
              <td className="text-right py-2 text-gray-500">{company.bitcoin}</td>
              <td className="text-right py-2 text-gray-500">{company.ethereum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublicCompaniesHoldings;