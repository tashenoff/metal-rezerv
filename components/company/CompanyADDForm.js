import Input from '../../components/Input';
import Button from '../../components/Button';

const CompanyForm = ({ companyName, setCompanyName, binOrIin, setBinOrIin, region, setRegion, contacts, setContacts, director, setDirector, handleCompanySubmit }) => (
  <form className="space-y-6 p-5 rounded-lg bg-base-100" onSubmit={handleCompanySubmit}>
    <h2 className="text-2xl font-semibold text-center text-primary">Создание компании</h2>
    <div className="space-y-4">
      <Input
        label="Название компании"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
        className="w-full p-3 border border-neutral rounded-lg"
      />
      <Input
        label="BIN/IIN"
        value={binOrIin}
        onChange={(e) => setBinOrIin(e.target.value)}
        required
        className="w-full p-3 border border-neutral rounded-lg"
      />
      <Input
        label="Регион"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
        className="w-full p-3 border border-neutral rounded-lg"
      />
      <Input
        label="Контакты"
        value={contacts}
        onChange={(e) => setContacts(e.target.value)}
        className="w-full p-3 border border-neutral rounded-lg"
      />
      <Input
        label="Директор"
        value={director}
        onChange={(e) => setDirector(e.target.value)}
        required
        className="w-full p-3 border border-neutral rounded-lg"
      />
    </div>
    <Button type="submit" className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-focus">
      Создать компанию
    </Button>
  </form>
);

export default CompanyForm;
