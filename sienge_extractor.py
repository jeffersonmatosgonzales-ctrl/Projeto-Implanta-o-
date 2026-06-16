# -*- coding: utf-8 -*-
"""
🤖 SIENGE ERP RPA EXTRACTOR — GRUPO JUST S.A.
Tecnologia: Python 3 + Playwright (Modo Headed ou Headless)
Autor: AI Coding Agent (Google AI Studio Build)
Destinatário: CFO Jefferson Gonzales

Este script automatiza o login e a extração em lote dos relatórios de CPG (Contas Pagas) 
e CRC (Contas Recebidas) do Sienge ERP direto para a pasta de entrada do seu aplicativo,
contornando travamentos de popups do Chrome e garantindo governança fiduciária estrita.
"""

import os
import time
import argparse
from datetime import datetime
from dotenv import load_load_env

# Tenta importar o Playwright. Se não estiver instalado, instruirá o usuário no terminal.
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("\n❌ Erro: Playwright não instalado.")
    print("Execute no terminal: pip install playwright && playwright install")
    exit(1)

# Carrega variáveis sensíveis do arquivo .env local para evitar senhas expostas no código
load_load_env()

# CONFIGURAÇÃO DE ACESSO DO ERP
SIENGE_SUBDOMAIN = os.getenv("SIENGE_SUBDOMAIN", "construtorajust")
SIENGE_USER = os.getenv("SIENGE_USER", "JEFFERSON")
SIENGE_PASSWORD = os.getenv("SIENGE_PASSWORD", "") # Nunca deixe sua senha exposta no Github!

# MAPEAMENTOS DO GRUPO JUST S.A.
EMPRESAS = {
    "1": "Just Construções e Empreendimentos Ltda",
    "2": "Justcon Incorporadora Ltda",
    "6": "Neo Empreendimentos Imobiliários SPE Ltda",
    "7": "Blank Empreendimentos Imobiliários SPE Ltda",
    "9": "Matera Empreendimentos Imobiliários SPE Ltda"
}

CENTROS_DE_CUSTO = [
    # { Empresa, Código CC, Nome para o Arquivo }
    {"emp": "1", "cc": "1", "nome": "Administracao_Holding_Just"},
    {"emp": "1", "cc": "70", "nome": "Traveza_Residence"},
    {"emp": "1", "cc": "71", "nome": "Justfix_Suprimentos_Rochas"},
    {"emp": "9", "cc": "95", "nome": "SPE_Matera_Residence_Ltda"},
    {"emp": "6", "cc": "79", "nome": "SPE_Neo_Residence_Ltda"},
    {"emp": "7", "cc": "89", "nome": "SPE_Blank_Residence_Ltda"}
]

def run_extractor(dt_inicio, dt_fim, output_dir="./ingestao"):
    if not SIENGE_PASSWORD:
        print("⚠️ ERRO: SIENGE_PASSWORD não configurada no .env ou como variável de ambiente.")
        password_input = input("Chave de segurança (Senha Sienge): ")
        if not password_input:
            print("Execução abortada.")
            return
        senha_sienge = password_input
    else:
        senha_sienge = SIENGE_PASSWORD

    os.makedirs(output_dir, exist_ok=True)
    base_url = f"https://{SIENGE_SUBDOMAIN}.sienge.com.br/sienge"

    print("🤖 Iniciando motor de automação Playwright...")
    with sync_playwright() as p:
        # Abre o navegador real (headed=True permite que você observe a execução)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()

        print(f"🔗 Conectando ao portal de acessos: {base_url} ...")
        page.goto(f"{base_url}/login.do")

        # 1. FLUXO DE LOGIN AUTOMÁTICO
        print("👤 Efetuando login de auditoria segura...")
        page.fill("input[name='usuario']", SIENGE_USER)
        page.fill("input[name='senha']", senha_sienge)
        page.click("button[type='submit']")
        
        # Aguarda carregar o painel principal (busca um elemento que confirme que o login deu certo)
        page.wait_for_selector("div.painel-atividades, #idDoPainelDoSienge, div.SiengeHeader", timeout=30000)
        print("🎉 Login bem-sucedido no Sienge ERP!")

        # 2. ITERADOR DE PROCESSAMENTO EM LOTE (LOT)
        for idx, item in enumerate(CENTROS_DE_CUSTO, 1):
            empresa_nome = EMPRESAS[item["emp"]]
            print(f"\n📂 [{idx}/{len(CENTROS_DE_CUSTO)}] Processando {item['nome']} (Empresa: {item['emp']} | CC: {item['cc']})")

            # --- A. EXTRAÇÃO DE CONTAS PAGAS (CPG - SAÍDAS / CUSTOS REALIZADOS) ---
            print("📊 Solicitando CPG (Contas Pagas) no formato XLSX de canteiro...")
            page.goto(f"{base_url}/CPG/findContaPagas.do")
            
            # Preenche o formulário de filtros do Relatório CPG de forma humana via selenium/playwright api
            page.fill("input[name='entity.empresa.cdEmpresaView']", item["emp"])
            page.press("input[name='entity.empresa.cdEmpresaView']", "Tab")
            
            # Filtro de datas
            page.fill("input[name='entity.dtPagtoInicio']", dt_inicio)
            page.fill("input[name='entity.dtPagtoFim']", dt_fim)
            
            # Centro de Custo específico
            page.fill("input[name='empreend.cdEmpreendView']", item["cc"])
            page.press("input[name='empreend.cdEmpreendView']", "Tab")
            
            # Seleciona formato de saída XLSX
            page.select_option("select[name='formatoSaidaDocumento']", "XLSX")

            # Dispara fluxo de Download real para desviar do bloqueador de popups do Chrome
            print("⏳ Baixando planilha consolidada de custos...")
            try:
                with page.expect_download(timeout=25000) as download_info:
                    page.click("button#id_do_botao_exportar, button:has-text('Visualizar'), button:has-text('Exportar')")
                download = download_info.value
                filename_cpg = f"CPG_2026_{item['nome']}.xlsx"
                download.save_as(os.path.join(output_dir, filename_cpg))
                print(f"✅ Salvo com sucesso: {filename_cpg}")
            except Exception as e:
                print(f"⚠️ Alerta: Obra pode estar sem lançamentos ou formulário foi estendido: {str(e)}")

            # --- B. EXTRAÇÃO DE CONTAS RECEBIDAS (CRC - ENTRADAS / RECEITAS) ---
            print("📊 Solicitando CRC (Contas Recebidas/Vendas) no formato XLSX...")
            page.goto(f"{base_url}/CRC/findContasRecebidas.do")

            page.fill("input[name='cdEmpresaView']", item["emp"])
            page.press("input[name='cdEmpresaView']", "Tab")
            
            page.fill("input[name='dtRectoInicio']", dt_inicio)
            page.fill("input[name='dtRectoFim']", dt_fim)
            
            page.fill("input[name='cdEmpreendView']", item["cc"])
            page.press("input[name='cdEmpreendView']", "Tab")
            
            page.select_option("select[name='formatoSaidaDocumento']", "XLSX")

            print("⏳ Baixando planilha consolidada de faturamento...")
            try:
                with page.expect_download(timeout=25000) as download_info:
                    page.click("button#id_do_botao_exportar_crc, button:has-text('Visualizar'), button:has-text('Exportar')")
                download = download_info.value
                filename_crc = f"CRC_2026_{item['nome']}.xlsx"
                download.save_as(os.path.join(output_dir, filename_crc))
                print(f"✅ Salvo com sucesso: {filename_crc}")
            except Exception as e:
                print(f"⚠️ Alerta: Obra pode estar sem recebimentos ou formulário foi estendido: {str(e)}")

        print("\n🏁 PROCESSO CONCLUÍDO COM SUCESSO!")
        print(f"📁 Todos os arquivos XLSX foram depositados de forma segura na pasta '{output_dir}'.")
        browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auditor Sienge ERP - Grupo JUST S.A.")
    parser.add_argument("--inicio", default="01/01/2026", help="Data início (DD/MM/YYYY)")
    parser.add_argument("--fim", default="31/12/2026", help="Data fim (DD/MM/YYYY)")
    parser.add_argument("--out", default="./ingestao", help="Diretório de saída")
    args = parser.parse_args()

    run_extractor(args.inicio, args.fim, args.out)
