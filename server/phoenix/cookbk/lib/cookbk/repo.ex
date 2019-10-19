defmodule Cookbk.Repo do
  use Ecto.Repo,
    otp_app: :cookbk,
    adapter: Ecto.Adapters.Postgres
end
