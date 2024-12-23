using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace EmployeeApp.ViewModels
{
	public class MainWindowViewModel : INotifyPropertyChanged
	{
		private string serverIp;
		private string employeeId;
		private int timeDifference;

		public string ServerIp
		{
			get => serverIp;
			set
			{
				serverIp = value;
				OnPropertyChanged();
			}
		}

		public string EmployeeId
		{
			get => employeeId;
			set
			{
				employeeId = value;
				OnPropertyChanged();
			}
		}

		public int TimeDifference
		{
			get => timeDifference;
			set
			{
				timeDifference = value;
				OnPropertyChanged();
			}
		}

		public event PropertyChangedEventHandler PropertyChanged;

		protected void OnPropertyChanged([CallerMemberName] string name = null)
		{
			PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
		}
	}
}
