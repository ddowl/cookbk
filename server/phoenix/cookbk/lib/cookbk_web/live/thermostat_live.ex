defmodule CookbkWeb.ThermostatLive do
  # If you generated an app with mix phx.new --live,
  # the line below would be: use MyAppWeb, :live_view
  use CookbkWeb, :live_view

  def mount(_params, session, socket) do
    if connected?(socket), do: Process.send_after(self(), :update, 5000)
    {:ok, assign(socket, :temperature, 10)}
  end

  def handle_info(:update, socket) do
    Process.send_after(self(), :update, 5000)
    {:noreply, assign(socket, :temperature, socket.assigns.temperature + 5)}
  end

  def handle_event("inc_temperature", _value, socket) do
    {:noreply, assign(socket, :temperature, socket.assigns.temperature + 1)}
  end
end