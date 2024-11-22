import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Notification from '../../components/Notification';
import BalanceTable from '../../components/company/BalanceTable';
import useBalanceHistory from '../../hooks/useBalanceHistory';

const CompanyBalanceHistory = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const { transfers, loading, error } = useBalanceHistory(companyId);

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">История пополнений</h1>

      {error && <Notification type="error" message={error} />}
      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <BalanceTable transfers={transfers} />
      )}
    </Layout>
  );
};

export default CompanyBalanceHistory;
