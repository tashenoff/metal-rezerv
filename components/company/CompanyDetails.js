const CompanyDetails = ({ company }) => (
    <div className="space-y-6 ">
      <h2 className="text-xl font-semibold">Моя компания {company.id}</h2>
      <div className="overflow-x-auto bg-base-100 ">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th className="text-center">Название</th>
              <th className="text-center">BIN/IIN</th>
              <th className="text-center">Регион</th>
              <th className="text-center">Контакты</th>
              <th className="text-center">Директор</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover">
              <td className="text-center">{company.name}</td>
              <td className="text-center">{company.binOrIin}</td>
              <td className="text-center">{company.region}</td>
              <td className="text-center">{company.contacts}</td>
              <td className="text-center">{company.director}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  
  export default CompanyDetails;
  