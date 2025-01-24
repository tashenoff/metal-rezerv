import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Notification from '../../components/ui/Notification';
import Steps from '../../components/ui/Steps';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const CreateCompany = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [binOrIin, setBinOrIin] = useState('');
  const [region, setRegion] = useState('');
  const [contacts, setContacts] = useState('');
  const [director, setDirector] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: 'Основная информация',
      content: (
        <div>
          <Input
            label="Название компании"
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <Input
            label="БИН или ИИН"
            name="binOrIin"
            value={binOrIin}
            onChange={(e) => setBinOrIin(e.target.value)}
            required
          />
          <Button
            className="btn-primary mt-4"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Далее
          </Button>
        </div>
      ),
    },
    {
      label: 'Дополнительная информация',
      content: (
        <div>
          <Textarea
            value={description}
            onChange={setDescription} // ReactQuill передает строку
            placeholder="Описание компании"
          />
          <Input
            label="Сайт компании"
            type="url"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Input
            label="График работы"
            name="workingHours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
          />
          <Input
            label="Адрес компании"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            className="btn-primary mt-4"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Далее
          </Button>
        </div>
      ),
    },
    {
      label: 'Контакты и директор',
      content: (
        <div>
          <Input
            label="Регион"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
          <Input
            label="Контакты"
            name="contacts"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            required
          />
          <Input
            label="Директор"
            name="director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            required
          />
        </div>
      ),
    },
  ];

  const handleCompanySubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !binOrIin || !region || !contacts || !director) {
      setMessage('Все поля должны быть заполнены');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          binOrIin,
          region,
          contacts,
          director,
          description,
          website,
          workingHours,
          address,
          ownerId: user.id,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage('Компания успешно создана!');
        setMessageType('success');
      } else {
        setMessage('Ошибка при создании компании!');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Произошла ошибка при создании компании!');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {message && <Notification message={message} type={messageType} />}
      {isLoading ? (
        <p className="text-center text-lg">Загрузка...</p>
      ) : (
        <>
          <div className="py-5">
            <h1>Регистрация компании</h1>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="bg-base-100 p-5 rounded-lg">
              Для регистрации на платформе необходимо предоставить корректную
              информацию. При регистрации компании требуется предоставить
              полное название, БИН или ИИН, а также информацию о руководителе
              компании. Платформа имеет право отклонить регистрацию, если
              предоставленная информация будет неполной или не соответствует
              действительности. Для использования платформы важно согласие с
              условиями политики конфиденциальности и пользовательским
              соглашением.
            </div>
            <form
              onSubmit={handleCompanySubmit}
              className="max-w-2xl mx-auto p-6 space-y-4 bg-base-100 rounded-lg shadow-lg"
            >
              <Steps
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />

              {currentStep === steps.length - 1 && (
                <Button type="submit" className="btn-primary w-full">
                  Создать компанию
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CreateCompany;
